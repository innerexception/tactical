import * as React from 'react'
import { onMoveUnit } from '../uiManager/Thunks'
import { Button, Card, Dialog, Tooltip, Position, Icon, Drawer, RadioGroup, Popover } from '@blueprintjs/core'
import AppStyles from '../../AppStyles';
import { Directions, TileType } from '../../../enum'
import * as background from '../../assets/basemap.jpg'

interface Props {
    activeSession: Session
    activePlayer: Player
    players: Array<Player>
    map: Array<Array<Tile>>
}

interface State {
    selectedTile: Tile
    movingUnit: Unit | null
    startX: number
    startY: number
}

export default class Map extends React.Component<Props, State> {

    state = {
        selectedTile: { x:-1, y:-1, type: TileType.GRASS, subType: '' },
        movingUnit: null as null,
        startX: -1,
        startY: -1
    }

    moveUnit = (unit:Unit, direction:Directions) => {
        if(unit.move > 0){
            switch(direction){
                case Directions.DOWN: unit.y++
                     break
                case Directions.UP: unit.y--
                     break
                case Directions.LEFT: unit.x--
                     break
                case Directions.RIGHT: unit.x++
                     break
            }
            unit.move--
        }
        onMoveUnit(unit, this.props.activeSession)
    }

    cancelMove = (unit:Unit) => {
        unit.move = unit.maxMove
        unit.x = this.state.startX
        unit.y = this.state.startY
        this.setState({movingUnit: null})
    }

    performSpecial = (unit:Unit) => {

    }

    getUnitActionButtons = (activePlayer:Player, unit?:Unit) => {
        if(unit){
            let isOwner = activePlayer.units.find((punit)=>unit.id === punit.id)
            if(isOwner){
                return <div>
                            {unit.move<unit.maxMove && <button onClick={()=>this.cancelMove(unit)}>Cancel</button>}
                            {unit.move===unit.maxMove && <button onClick={()=>this.setState({movingUnit: unit, startX: unit.x, startY: unit.y})}>Move</button>}
                            {unit.ability && <button onClick={()=>this.performSpecial(unit)}>{unit.ability}</button>}
                        </div>
            }
        }
        return <span/>
    }

    getMoveArrowsOfTile = (tile:Tile, players:Array<Player>, movingUnit?:Unit) => {
        let tileUnit = getUnitOfTile(tile, players) as Unit
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
                    {this.props.map.map((row, i) => 
                        <div style={{display:'flex'}}>
                            {row.map((tile:Tile) => 
                                <div style={{...styles.tile, background: 'transparent'}} 
                                    onClick={()=>this.setState({selectedTile: tile})}>
                                    <div style={{fontFamily:'Terrain', color: AppStyles.colors.white}}>{tile.subType}</div>
                                    {this.getMoveArrowsOfTile(tile, this.props.players, this.state.movingUnit)}
                                    {getUnitPortraitOfTile(tile, this.props.players, this.props.activePlayer)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div>
                    {getUnitInfoOfTile(this.state.selectedTile, this.props.players, this.props.activePlayer)}
                    {this.getUnitActionButtons(this.props.activePlayer, getUnitOfTile(this.state.selectedTile, this.props.players))}
                </div>
            </div>
        )
    }
}

const getUnitPortraitOfTile = (tile:Tile, players:Array<Player>, activePlayer:Player) => {
    let tileUnit = getUnitOfTile(tile, players) as Unit
    if(tileUnit){
        return <div style={{opacity: getUnitOpacity(tileUnit, activePlayer)}}>
                    <span>{tileUnit.rune}</span>
                    <div>{new Array(tileUnit.level).fill(null).map((lvl) =>  <div style={{...styles.levelBarOuter}}/>)}</div>
                    <div>{new Array(tileUnit.hp).fill(null).map((lvl) =>  <span>*</span>)}</div>
               </div>
    }
    return <span/>
}

const getUnitInfoOfTile = (tile:Tile, players:Array<Player>, activePlayer:Player) => {
    let unit = getUnitOfTile(tile, players) as Unit
    if(unit){
        let isOwner = activePlayer.units.find((punit)=>unit.id === punit.id)
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

const getUnitOfTile = (tile:Tile, players:Array<Player>) => {
    let foundUnit
    players.forEach((player) => player.units.forEach((unit) => {
        if(unit.x === tile.x && unit.y === tile.y) foundUnit=unit
    }))
    return foundUnit
}

const getUnitOpacity = (unit:Unit, activePlayer:Player) => {
    let isOwner = activePlayer.units.find((punit)=>unit.id === punit.id)
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