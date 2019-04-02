import * as React from 'react'
import { onMoveUnit } from '../uiManager/Thunks'
import { Button, Card, Dialog, Tooltip, Position, Icon, Drawer, RadioGroup, Popover } from '@blueprintjs/core'
import AppStyles from '../../AppStyles';
import { Directions, TileType } from '../../../enum'

interface Props {
    activeSession: Session
    activePlayer: Player
    players: Array<Player>
    map: Array<Array<Tile>>
}

interface State {
    selectedTile: Tile | null
    movingUnit: Unit | null
    startX: number
    startY: number
}

export default class Map extends React.Component<Props, State> {

    state = {
        selectedTile: null as null,
        movingUnit: null as null,
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
                this.setState({selectedTile: candidateTile}, 
                    ()=>onMoveUnit(unit, this.props.activeSession))
            }
        }
    }

    getObstruction = (x:number, y:number) => {
        let tile = this.props.map[y][x]
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
        this.setState({movingUnit: null})
        onMoveUnit(unit, this.props.activeSession)
    }

    performSpecial = (unit:Unit) => {

    }

    getUnitActionButtons = (activePlayer:Player, unit?:Unit) => {
        if(unit){
            let isOwner = unit.ownerId === activePlayer.id
            if(isOwner){
                return <div>
                            {unit.move<unit.maxMove && this.state.movingUnit && <button onClick={()=>this.cancelMove(unit)}>Reset</button>}
                            {unit.move<unit.maxMove && this.state.movingUnit && <button onClick={()=>this.setState({movingUnit:null})}>Accept</button>}
                            {unit.move===unit.maxMove && <button onClick={()=>this.setState({movingUnit: unit, startX: unit.x, startY: unit.y})}>Move</button>}
                            {unit.ability && <button onClick={()=>this.performSpecial(unit)}>{unit.ability}</button>}
                        </div>
            }
        }
        return <span/>
    }

    getMoveArrowsOfTile = (tile:Tile, players:Array<Player>, movingUnit?:Unit) => {
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

    render(){
        return (
            <div style={styles.frame}>
                <div>
                    {this.props.map.map((row, y) => 
                        <div style={{display:'flex'}}>
                            {row.map((tile:Tile, x) => 
                                <div style={{...styles.tile, background: 'transparent'}} 
                                    onClick={this.state.movingUnit ? null : ()=>this.setState({selectedTile: tile})}>
                                    <div style={{fontFamily:'Terrain', color: AppStyles.colors.white}}>{tile.subType}</div>
                                    {this.state.movingUnit && this.getMoveArrowsOfTile(tile, this.props.players, this.state.movingUnit)}
                                    {getUnitPortraitOfTile(tile, this.props.players, this.props.activePlayer)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div>
                    {this.state.selectedTile && getUnitInfoOfTile(this.state.selectedTile, this.props.activePlayer)}
                    {this.state.selectedTile && this.getUnitActionButtons(this.props.activePlayer, (this.state.selectedTile as Tile).unit)}
                </div>
            </div>
        )
    }
}

const getUnitPortraitOfTile = (tile:Tile, players:Array<Player>, activePlayer:Player) => {
    let tileUnit = tile.unit
    if(tileUnit){
        return <div style={{opacity: getUnitOpacity(tileUnit, activePlayer)}}>
                    <span>{tileUnit.rune}</span>
                    <div>{new Array(tileUnit.level).fill(null).map((lvl) =>  <div style={{...styles.levelBarOuter}}/>)}</div>
                    <div>{new Array(tileUnit.hp).fill(null).map((lvl) =>  <span>*</span>)}</div>
               </div>
    }
    return <span/>
}

const getUnitInfoOfTile = (tile:Tile, activePlayer:Player) => {
    let unit = tile.unit
    if(unit){
        let isOwner = unit.ownerId === activePlayer.id
        return <div>
                    <h4>{tile.type}</h4>
                    <h4>{unit.descriptions[Math.floor(Math.random() * Math.floor(unit.descriptions.length))]}</h4>
                    {isOwner && <h4>M: {unit.move} / {unit.maxMove}</h4>}
               </div>
    }
    else 
        return <div>
                    <h4>{tile.type}</h4>
               </div>
}

const getUnitOpacity = (unit:Unit, activePlayer:Player) => {
    let isOwner = unit.ownerId === activePlayer.id
    if(isOwner) return 1
    else {
        //TODO determine closest owned unit to this unowned unit
        return 0.5
    }
}

const styles = {
    frame: {
        padding:'3em',
        position:'relative' as 'relative',
        backgroundImage: 'url(./build'+require('../../assets/basemap.jpg')+')',
        backgroundPosition:'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
    },
    tile: {
        width: '2em',
        height:'2em',
        border: '1px dashed',
        position:'relative' as 'relative'
    },
    levelBarOuter: {
        width:'100%',
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