import * as React from 'react'
import { onMoveUnit, onAttackTile, onEndTurn, onUpdateUnit } from '../uiManager/Thunks'
import AppStyles from '../../AppStyles';
import { FourCoordinatesArray, EightCoordinatesArray, TileType, MatchStatus, Abilities, Traits, Directions } from '../../../enum'
import { Button, LightButton } from '../Shared'
import { toast } from '../uiManager/toast';
import { getRandomInt } from '../Util';

interface Props {
    activeSession: Session
    me: Player
    players: Array<Player>
    map: Array<Array<Tile>>
    isActive: boolean
}

interface State {
    selectedTile: Tile | null
    movingUnit: Unit | null
    attackingUnit: Unit | null
    showDescription: Unit | null
    highlightTiles: Array<Array<boolean>>
    visibleTiles: Array<Array<boolean>>
    startX: number
    startY: number
}

export default class Map extends React.Component<Props, State> {

    state = {
        selectedTile: null as null,
        movingUnit: null as null,
        attackingUnit: null as null,
        showDescription: null as null,
        highlightTiles: [[false]],
        visibleTiles: getVisibleTilesOfPlayer(this.props.me, this.props.map),
        startX: -1,
        startY: -1
    }

    endTurn = () => {
        this.setState({selectedTile: null})
        onEndTurn(this.props.activeSession)
    }

    getNotification = () => {
        let activeName = this.props.players.find(player=>player.id===this.props.activeSession.activePlayerId).name
        if(this.props.activeSession.status === MatchStatus.WIN)
            return <div style={{...styles.disabled, display: 'flex'}}>
                        <div style={AppStyles.notification}>
                            {activeName} is Victorious
                        </div>
                    </div>
        else if(!this.props.isActive)
            return (
                <div style={{...styles.disabled, display: 'flex'}}>
                    <div style={AppStyles.notification}>
                        Waiting for {activeName}...
                    </div>
                </div>
            )
        else if(this.state.showDescription)
            return (
                <div style={{...styles.disabled, display: 'flex'}}>
                    <div style={AppStyles.notification}>
                        <div style={{marginBottom:'0.5em'}}>
                            <span style={{fontFamily:'Rune', marginRight:'1em'}}>{(this.state.showDescription as Unit).rune}</span>
                            {(this.state.showDescription as Unit).description}
                        </div>
                        {Button(true, ()=>this.setState({showDescription:null}), 'Done')}
                    </div>
                </div>
            )
    }

    getUnitInfoOfTile = () => {
        let tile = this.state.selectedTile
        if(tile){
            let unit = (tile as any).unit
            if(unit){
                let isOwner = unit.ownerId === this.props.me.id
                return <div style={styles.tileInfo}>
                            <div>
                                <h4 style={{margin:0}}>{(tile as any).type}</h4>
                                <h4 style={{margin:0}}>{unit.type}</h4>
                                {LightButton(true, ()=>this.setState({showDescription: unit}), 'Info')}
                            </div>
                            <div>
                                {isOwner && <h4 style={{margin:0}}>M: {unit.move} / {unit.maxMove}</h4>}
                                {this.getUnitActionButtons(this.props.me, unit)}
                            </div>
                        </div>
            }
            else
                return <div style={styles.tileInfo}>
                            <h4>{(tile as any).type}</h4>
                        </div>
        }
        return <div style={styles.tileInfo}>No selection...</div>
    }
    

    moveUnit = (unit:Unit, direction:Directions) => {
        let candidateTile = {...this.state.selectedTile as Tile}
        if(unit.move > 0){
            switch(direction){
                case Directions.DOWN: candidateTile.y++
                     break
                case Directions.UP: candidateTile.y--
                     break
                case Directions.LEFT: candidateTile.x--
                     break
                case Directions.RIGHT: candidateTile.x++
                     break
            }
            if(!this.getObstruction(candidateTile.x, candidateTile.y, unit)){
                unit.x = candidateTile.x
                unit.y = candidateTile.y
                unit.move--
                candidateTile.unit = unit
                this.setState({selectedTile: candidateTile, visibleTiles: getVisibleTilesOfPlayer(this.props.me, this.props.map)}, 
                    ()=>onMoveUnit(unit, this.props.activeSession))
            }
        }
    }

    getObstruction = (x:number, y:number, unit:Unit) => {
        let tile = this.props.map[x][y]
        if(tile){
            if(tile.unit) return true
            if(tile.type === TileType.MOUNTAIN || tile.type===TileType.RIVER){
                if(unit.trait === Traits.FLOAT) return false
                if(unit.trait === Traits.WATERBREATH && tile.type === TileType.RIVER) return false
                return true 
            } 
            return false
        }
        return true
    }

    cancelMove = (unit:Unit) => {
        unit.move = unit.maxMove
        unit.x = this.state.startX
        unit.y = this.state.startY
        this.setState({selectedTile: this.props.map[unit.y][unit.x], movingUnit: null, attackingUnit: null, highlightTiles: [[false]]})
        onMoveUnit(unit, this.props.activeSession)
    }

    performSpecial = (unit:Unit) => {
        switch(unit.ability){
            case Abilities.CHARGE:
                unit.move = unit.maxMove+1
                unit.abilityCooldown=2
        }
        onUpdateUnit(unit, this.props.activeSession)
    }

    showAttackTiles = (unit:Unit) => {
        let highlightTiles = getTilesInRange(unit, this.props.map)
        this.setState({attackingUnit: unit, highlightTiles})
    }

    hideAttackTiles = () => {
        this.setState({attackingUnit: null, highlightTiles:[[false]]})
    }

    performAttackOnTile = (tile:Tile) => {
        if(tile.unit){
            //TODO flash/shake tile's unit here
            onAttackTile(this.state.attackingUnit, tile, this.props.activeSession)
            if(tile.unit.trait === Traits.FIRESHOCK){
                let direction = getRandomInt(3)
                const directionTuple = FourCoordinatesArray[direction]
                let extraTile = this.props.activeSession.map[directionTuple.x][directionTuple.y]
                if(extraTile && extraTile.unit){
                    let chance = getRandomInt(3)===1
                    if(chance){
                        toast.show({message: 'Alchemist fire has damaged an adjacent unit.'})
                        onAttackTile(this.state.attackingUnit, extraTile, this.props.activeSession)
                    }
                }
            }
        }
        this.hideAttackTiles()
    }

    getUnitActionButtons = (me:Player, unit?:Unit) => {
        if(unit){
            let isOwner = unit.ownerId === me.id
            if(isOwner && this.props.isActive){
                let buttons = []
                if(this.state.attackingUnit){
                    buttons.push(LightButton(true, this.hideAttackTiles, 'Cancel'))
                }
                if(!this.state.attackingUnit){
                    if(this.state.selectedTile && (this.state.selectedTile as any).unit && (this.state.selectedTile as any).unit.attacks > 0)
                        if(!this.state.movingUnit) 
                            buttons.push(LightButton(true, ()=>this.showAttackTiles(unit), 'Attack'))
                }
                if(this.state.movingUnit){
                    if(unit.move<unit.maxMove){
                        buttons.push(LightButton(true, ()=>this.setState({movingUnit:null}), 'Accept'))
                        buttons.push(LightButton(true, ()=>this.cancelMove(unit), 'Reset'))
                    }
                }
                if(!this.state.movingUnit && !this.state.attackingUnit){
                    if(unit.move>=unit.maxMove) buttons.push(LightButton(true, ()=>this.setState({movingUnit: unit, startX: unit.x, startY: unit.y, attackingUnit:null, highlightTiles:[[false]]}), 'Move'))
                }
                if(unit.ability) buttons.push(LightButton(unit.abilityCooldown === 0, ()=>this.performSpecial(unit), unit.ability))

                return <div>
                            {buttons}
                       </div>
            }
        }
        return <span/>
    }

    getMoveArrowsOfTile = (tile:Tile, movingUnit?:Unit) => {
        let tileUnit = tile.unit
        if(tileUnit && movingUnit && tileUnit.id === movingUnit.id)
            return [
                    <div style={styles.leftArrow} onClick={()=>this.moveUnit(tileUnit, Directions.LEFT)}>{'<'}</div>,
                    <div style={styles.rightArrow} onClick={()=>this.moveUnit(tileUnit, Directions.RIGHT)}>></div>,
                    <div style={styles.upArrow} onClick={()=>this.moveUnit(tileUnit, Directions.UP)}>^</div>,
                    <div style={styles.downArrow} onClick={()=>this.moveUnit(tileUnit, Directions.DOWN)}>v</div>
                ]
        return <span/>
    }

    getTileClickHandler = (tile:Tile) => {
        if(this.state.movingUnit) return null
        if(this.state.attackingUnit) return ()=>this.performAttackOnTile(tile)
        return ()=>this.setState({selectedTile: tile, attackingUnit:null, highlightTiles:[[false]]})
    }

    render(){
        return (
            <div>
                {this.getUnitInfoOfTile()}
                <div style={{position:'relative'}}>
                    <div style={styles.mapFrame}>
                        <div style={{display:'flex'}}>
                            {this.props.map.map((row, x) => 
                                <div>
                                    {row.map((tile:Tile, y) => 
                                        <div style={{
                                                ...styles.tile, 
                                                opacity: getTileOpacity(tile, this.props.me, this.state.visibleTiles),
                                                background: this.state.highlightTiles[x] && this.state.highlightTiles[x][y]===true ? AppStyles.colors.grey2 : 'transparent',
                                                borderStyle: isSelectedTile(tile, this.state.selectedTile) ? 'dashed' : 'dotted'
                                            }} 
                                            onClick={this.getTileClickHandler(tile)}>
                                            <div style={{fontFamily:'Terrain', color: AppStyles.colors.grey3, fontSize:'2em'}}>{tile.subType}</div>
                                            {this.state.movingUnit && this.getMoveArrowsOfTile(tile, this.state.movingUnit)}
                                            {getUnitPortraitOfTile(tile)}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    {this.getNotification()}
                </div>
                <div style={{marginTop:'0.5em'}}>
                    {this.props.activeSession.status === MatchStatus.ACTIVE && 
                        Button(this.props.isActive && hasNoMoves(this.props.me, this.props.map), this.endTurn, 'End Turn')}
                </div>
            </div>
            
        )
    }
}

const hasNoMoves = (player:Player, map:Array<Array<Tile>>) => {
    let playerUnits = new Array<Unit>()
    map.forEach(row=>row.forEach(tile=>{if(tile.unit && tile.unit.ownerId === player.id)playerUnits.push(tile.unit)}))
    playerUnits = playerUnits.filter(unit=>unit.move > 0)
    return playerUnits.length === 0
}

const getUnitPortraitOfTile = (tile:Tile) => {
    let tileUnit = tile.unit
    if(tileUnit){
        return <div style={{textAlign:'right', position:'absolute', top:0, right:0}}>
                    <span style={{fontFamily:'Rune'}}>{tileUnit.rune}</span>
                    <div>{new Array(tileUnit.hp).fill(null).map((hp) =>  <span>*</span>)}</div>
               </div>
    }
    return <span/>
}

const getTileOpacity = (tile:Tile, me:Player, visibleTiles: Array<Array<boolean>>) => {
    if(tile.unit){
        let isOwner = tile.unit.ownerId === me.id
        if(isOwner) return 1
        else {
            return visibleTiles[tile.unit.x][tile.unit.y] ? 0.5 : 0
        }
    }
    
    return visibleTiles[tile.x][tile.y] ? 1 : 0.5
}

const getTilesInRange = (unit:Unit, map:Array<Array<Tile>>) => {
    let tiles = new Array(map.length).fill(null).map((item) => 
                    new Array(map[0].length).fill(false))
    FourCoordinatesArray.forEach((direction) => {
        let candidateX = unit.x
        let candidateY = unit.y
        for(var i=unit.range; i>0; i--){
            candidateX += direction.x
            candidateY += direction.y
            if(candidateY >= 0 && candidateX >= 0 
                && candidateX < map.length 
                && candidateY < map[0].length)
                tiles[candidateX][candidateY] = true
        }
    })
    return tiles
}

const isSelectedTile = (tile:Tile, selectedTile?:Tile) => {
    if(selectedTile){
        return tile.x === selectedTile.x && tile.y === selectedTile.y
    }
    return false
}

const getVisibleTilesOfPlayer = (player:Player, map:Array<Array<Tile>>) => {
    let units= new Array<Unit>()
    map.forEach(row => row.forEach((tile:Tile) => {
        if(tile.unit && tile.unit.ownerId === player.id)
            units.push(tile.unit)
    }))
    return getVisibleTilesOfUnits(units, map)
}

const getVisibleTilesOfUnits = (units:Array<Unit>, map:Array<Array<Tile>>) => {
    let tiles = new Array(map.length).fill(null).map((item) => 
                    new Array(map[0].length).fill(false))
    units.forEach(unit => {
        EightCoordinatesArray.forEach((direction) => {
            let candidateX = unit.x
            let candidateY = unit.y
            for(var i=unit.sight; i>0; i--){
                candidateX += direction.x
                candidateY += direction.y
                if(candidateY >= 0 && candidateX >= 0 
                    && candidateX < map.length 
                    && candidateY < map[0].length)
                    tiles[candidateX][candidateY] = true
            }
        })
    })
    return tiles
}

const styles = {
    disabled: {
        pointerEvents: 'none' as 'none',
        alignItems:'center', justifyContent:'center', 
        position:'absolute' as 'absolute', top:0, left:0, width:'100%', height:'100%'
    },
    mapFrame: {
        position:'relative' as 'relative',
        backgroundImage: 'url('+require('../../assets/whiteTile.png')+')',
        backgroundRepeat: 'repeat',
        overflow:'auto',
        maxHeight:'60vh',
        maxWidth:'100%'
    },
    tileInfo: {
        height: '5em',
        backgroundImage: 'url('+require('../../assets/whiteTile.png')+')',
        backgroundRepeat: 'repeat',
        marginBottom: '0.5em',
        padding: '0.5em',
        border: '1px dotted',
        display:'flex',
        justifyContent:'space-between'
    },
    tile: {
        width: '2em',
        height:'2em',
        border: '1px',
        position:'relative' as 'relative'
    },
    levelBarOuter: {
        height:'0.25em',
        background: AppStyles.colors.white
    },
    leftArrow: {
        position:'absolute' as 'absolute',
        left:'-1em',
        top:0,
        bottom:0,
        width:'1em',
        height:'1em',
        cursor:'pointer',
        zIndex:2
    },
    rightArrow: {
        position:'absolute' as 'absolute',
        right:'-2em',
        top:0,
        bottom:0,
        width:'1em',
        height:'1em',
        cursor:'pointer',
        zIndex:2
    },
    upArrow: {
        position:'absolute' as 'absolute',
        right:0,
        top:'-1em',
        left:'1em',
        width:'1em',
        height:'1em',
        cursor:'pointer',
        zIndex:2
    },
    downArrow: {
        position:'absolute' as 'absolute',
        right:0,
        bottom:'-1em',
        left:'1em',
        width:'1em',
        height:'1em',
        cursor:'pointer',
        zIndex:2
    }
}