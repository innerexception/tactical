import * as React from 'react'
import { onMoveUnit, onAttackTile, onEndTurn } from '../uiManager/Thunks'
import { Card, Dialog, Tooltip, Position, Icon, PopoverInteractionKind, RadioGroup, Popover } from '@blueprintjs/core'
import AppStyles from '../../AppStyles';
import { Directions, TileType } from '../../../enum'
import { Button, LightButton } from '../Shared'

interface Props {
    activeSession: Session
    activePlayer: Player
    players: Array<Player>
    map: Array<Array<Tile>>
}

interface State {
    selectedTile: Tile | null
    movingUnit: Unit | null
    attackingUnit: Unit | null
    highlightTiles: Array<Array<boolean>>
    startX: number
    startY: number
}

export default class Map extends React.Component<Props, State> {

    state = {
        selectedTile: null as null,
        movingUnit: null as null,
        attackingUnit: null as null,
        highlightTiles: [[false]],
        startX: -1,
        startY: -1
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
            if(!this.getObstruction(candidateTile.x, candidateTile.y)){
                unit.x = candidateTile.x
                unit.y = candidateTile.y
                unit.move--
                candidateTile.unit = unit
                this.setState({selectedTile: candidateTile}, 
                    ()=>onMoveUnit(unit, this.props.activeSession))
            }
        }
    }

    getObstruction = (x:number, y:number) => {
        let tile = this.props.map[x][y]
        if(tile){
            if(tile.unit) return true
            if(tile.type === TileType.MOUNTAIN || tile.type===TileType.RIVER) return true    
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
        }
        this.hideAttackTiles()
    }

    getUnitActionButtons = (activePlayer:Player, unit?:Unit) => {
        if(unit){
            let isOwner = unit.ownerId === activePlayer.id
            if(isOwner){
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
                    if(unit.move===unit.maxMove) buttons.push(LightButton(true, ()=>this.setState({movingUnit: unit, startX: unit.x, startY: unit.y, attackingUnit:null, highlightTiles:[[false]]}), 'Move'))
                }
                if(unit.ability) buttons.push(LightButton(true, ()=>this.performSpecial(unit), unit.ability))

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
                {getUnitInfoOfTile(this.state.selectedTile, this.props.activePlayer, this.getUnitActionButtons)}
                <div style={styles.mapFrame}>
                    <div style={{display:'flex'}}>
                        {this.props.map.map((row, x) => 
                            <div>
                                {row.map((tile:Tile, y) => 
                                    <div style={{
                                            ...styles.tile, 
                                            background: this.state.highlightTiles[x] && this.state.highlightTiles[x][y]===true ? AppStyles.colors.grey2 : 'transparent',
                                            borderStyle: isSelectedTile(tile, this.state.selectedTile) ? 'dashed' : 'dotted'
                                        }} 
                                        onClick={this.getTileClickHandler(tile)}>
                                        <div style={{fontFamily:'Terrain', color: AppStyles.colors.grey3, fontSize:'2em'}}>{tile.subType}</div>
                                        {this.state.movingUnit && this.getMoveArrowsOfTile(tile, this.state.movingUnit)}
                                        {getUnitPortraitOfTile(tile, this.props.activePlayer)}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>  
                    {hasNoMoves(this.props.activePlayer, this.props.map) && Button(true, ()=>onEndTurn(this.props.activeSession), 'End Turn')}
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

const getUnitPortraitOfTile = (tile:Tile, activePlayer:Player) => {
    let tileUnit = tile.unit
    if(tileUnit){
        return <div style={{opacity: getUnitOpacity(tileUnit, activePlayer), textAlign:'right', position:'absolute', top:0, right:0}}>
                    <span style={{fontFamily:'Rune'}}>{tileUnit.rune}</span>
                    <div>{new Array(tileUnit.level).fill(null).map((lvl) =>  <div style={{...styles.levelBarOuter}}/>)}</div>
                    <div>{new Array(tileUnit.hp).fill(null).map((lvl) =>  <span>*</span>)}</div>
               </div>
    }
    return <span/>
}

const getUnitInfoOfTile = (tile:Tile, activePlayer:Player, getUnitActionButtons:Function) => {
    if(tile){
        let unit = tile.unit
        if(unit){
            let isOwner = unit.ownerId === activePlayer.id
            return <div style={styles.tileInfo}>
                        <div>
                            <h4 style={{margin:0}}>{tile.type}</h4>
                            <h4 style={{margin:0}}>{unit.type}</h4>
                            <h4 style={{margin:0}}>{unit.description}</h4>
                        </div>
                        <div>
                            {isOwner && <h4 style={{margin:0}}>M: {unit.move} / {unit.maxMove}</h4>}
                            {getUnitActionButtons(activePlayer, unit)}
                        </div>
                    </div>
        }
        else
            return <div style={styles.tileInfo}>
                        <h4>{tile.type}</h4>
                    </div>
    }
    return <div style={styles.tileInfo}></div>
}

const getUnitOpacity = (unit:Unit, activePlayer:Player) => {
    let isOwner = unit.ownerId === activePlayer.id
    if(isOwner) return 1
    else {
        //TODO determine closest owned unit to this unowned unit
        return 0.5
    }
}

const getTilesInRange = (unit:Unit, map:Array<Array<Tile>>) => {
    let directions = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}]
    let tiles = new Array(map.length).fill(null).map((item) => 
                    new Array(map[0].length).fill(false))
    directions.forEach((direction) => {
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

const styles = {
    mapFrame: {
        position:'relative' as 'relative',
        backgroundImage: 'url(./build'+require('../../assets/whiteTile.png')+')',
        backgroundRepeat: 'repeat',
        overflow:'auto',
        maxHeight:'60vh',
        maxWidth:'100%'
    },
    tileInfo: {
        height: '5em',
        backgroundImage: 'url(./build'+require('../../assets/whiteTile.png')+')',
        backgroundRepeat: 'repeat',
        marginBottom: '0.5em',
        padding: '0.5em',
        border: '1px dotted',
        display:'flex'
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