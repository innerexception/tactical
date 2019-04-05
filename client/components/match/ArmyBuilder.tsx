import * as React from 'react'
import { onMatchTick, onPlayerReady, onEndTurn } from '../uiManager/Thunks'
import { Radio, RadioGroup, Position } from '@blueprintjs/core'
import AppStyles from '../../AppStyles';
import { TopBar, Button } from '../Shared'
import { MatchStatus, UnitType, Army, Units } from '../../../enum';
import Maps from '../../assets/Maps'

interface Props {
    me: Player
    activeSession: Session
}

interface State {
    army: Array<Unit>
    armyType: Army
    points: number
    showArmyPlacement: boolean
    placingUnit: Unit | null
}

export default class ArmyBuilder extends React.Component<Props, State> {

    state = {
        army: Array<Unit>(),
        armyType: Army.LIVING,
        points: 30,
        showArmyPlacement: false,
        placingUnit: null as null
    }

    setUnitTypeCount = (count:number, type:UnitType) => {
        let army = this.state.army.filter((unit) => unit.type !== type)
        army = army.concat(new Array(count).fill(
            {...Units[this.state.armyType].find((unit) => unit.type === type)}
        ))
        this.setState({army, points: 30 - this.getArmyValue(army)})
    }

    setUnitCoords = (unit:Unit, x:number, y:number) => {
        let army = this.state.army.map((aunit) => {
            if(aunit.id === unit.id) return {...aunit, x, y}
            return aunit
        })
        this.setState({army, placingUnit:null})
    }

    prepArmy = () => {
        let army = this.state.army.map((unit, i) => {
            return {
                ...unit,
                id: Date.now()+''+Math.random(),
                ownerId: this.props.me.id,
                description: unit.descriptions[Math.floor(Math.random() * Math.floor(unit.descriptions.length))]
            }
        })
        return army
    }

    getArmyValue = (army:Array<Unit>) => {
        let cost = 0
        army.forEach((unit) => cost+=unit.cost)
        return cost
    }

    setPlayerReady = () => {
        onPlayerReady(this.props.me, this.state.army, this.props.activeSession)
    }

    render(){
        return (
            <div 
                 style={{...styles.modal, display: this.props.activeSession.status === MatchStatus.SETUP ? 'flex':'none'}}>
                {TopBar('Army Builder')}
                {this.props.me.isReady ? 
                    <div style={{padding:'1em', display:'flex', alignItems:'center', justifyContent:'center', height:'100%'}}>
                        <h3 style={{textAlign:'center', background:'white', padding:'1em', borderRadius:'5px'}}>
                            Waiting for players: {this.props.activeSession.players.filter((player) => !player.isReady).map((player) => player.name).join(', ')}
                        </h3>
                    </div> : 
                    <div style={{padding:'1em', display:'flex', flexDirection:'column', height:'100%', justifyContent:'space-between'}}>
                        <RadioGroup
                            inline
                            label="Army"
                            onChange={(e)=>this.setState({armyType: e.currentTarget.value as Army, points: 30, army: []})}
                            selectedValue={this.state.armyType}
                        >
                            <Radio label="Living" value={Army.LIVING} />
                            <Radio label="Dead" value={Army.DEAD} />
                        </RadioGroup>
                        <h4 style={{margin:0}}>Available Points: {this.state.points}</h4>
                        {this.state.showArmyPlacement ? 
                        <div style={{position:'relative'}}>
                            <div style={{display:'flex', fontFamily:'Rune'}}>
                                {this.state.army.filter((unit) => !unit.x && !unit.y).map((unit) => 
                                    <div onClick={()=>this.setState({placingUnit:unit})} style={{textAlign:'right', padding: '0.25em'}}>
                                        <span style={{color: (this.state.placingUnit && (this.state.placingUnit as any).id === unit.id) ? AppStyles.colors.grey2 : 'black'}}>
                                            {unit.rune}</span>
                                    </div>
                                )}
                            </div>
                            <div style={{display:'flex', fontFamily:'Rune'}}>
                                {Maps.StagingArea.map((row, x) => 
                                    <div>
                                        {row.map((col, y) => 
                                            <div style={styles.tile} 
                                                onClick={()=>this.setUnitCoords(this.state.placingUnit, x, y)}>
                                                {this.state.army.filter(unit=>unit.x === x && unit.y===y).map(unit=>
                                                    <span> 
                                                        {unit.rune}
                                                    </span>)}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        : 
                        <div style={styles.scrollContainer}>
                            {Units[this.state.armyType].map((unit) => 
                                <div style={{display:'flex', justifyContent:'space-between'}}>
                                    <div style={styles.unitRow}>
                                        <div style={{fontFamily:'Rune', fontSize:'1em', width: '2em'}}>{unit.rune}</div>
                                        <div>{unit.name}</div>
                                    </div>
                                    <div style={{display:'flex'}}>
                                        <div style={styles.circleButton} onClick={()=>this.setUnitTypeCount(getUnitCount(this.state.army, unit.type)+1, unit.type)}>+</div>
                                        <div style={styles.circleButton}>{getUnitCount(this.state.army, unit.type)}</div>
                                        <div style={styles.circleButton} onClick={()=>this.setUnitTypeCount(getUnitCount(this.state.army, unit.type)-1, unit.type)}>-</div>
                                    </div>
                                </div>
                            )}
                        </div> }
                        {this.state.showArmyPlacement && Button(this.state.army.filter((unit) => !unit.x).length===0, ()=>this.setPlayerReady(), 'Done')}
                        {!this.state.showArmyPlacement && Button(this.state.army.length > 0, ()=>this.setState({showArmyPlacement:true, army: this.prepArmy()}), 'Place')}
                    </div>
                }
            </div>)
    }
}

const getUnitCount = (army:Array<Unit>, unitType:UnitType) => army.filter((aunit)=>aunit.type === unitType).length

const styles = {
    frame: {
        padding:'1em',
        position:'relative' as 'relative'
    },
    modal: {
        backgroundImage: 'url(./build'+require('../../assets/tiny2.png')+')',
        backgroundRepeat: 'repeat',
        position:'absolute' as 'absolute',
        top:0, left:0, right:0, bottom:0,
        maxWidth: '20em',
        maxHeight: '20em',
        border: '1px solid',
        borderRadius: '5px',
        margin: 'auto',
        flexDirection: 'column' as 'column',
        justifyContent: 'flex-start'
    },
    circleButton: {
        cursor:'pointer',
        height:'2em',
        width:'2em',
        display:'flex',
        alignItems:'center',
        justifyContent: 'center'
    },
    choiceBtn: {
        margin: 0,
        cursor: 'pointer',
        border: '1px solid',
        padding: '0.5em',
        borderRadius: '5px',
    },
    disabled: {
        position:'absolute' as 'absolute',
        top:0,
        left:0,
        background:'black',
        opacity: 0.1,
        width:'100vw',
        height:'100vh'
    },
    toggleButton: {
        cursor:'pointer',
        border:'1px solid',
        borderRadius: '3px',
        padding:'0.5em'
    },
    topBar: {
        background: 'white',
        display:'flex',
        justifyContent:'space-around',
        alignItems: 'center',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
    },
    hr: {
        margin:0,
        marginBottom:'1px'
    },
    scrollContainer: {
        overflow: 'auto',
        height: '66%',
        marginBottom:'0.5em',
        marginTop: '0.5em',
        background: 'white',
        border: '1px solid',
        padding: '0.5em'
    },
    unitRow: {
        display: 'flex',
        alignItems: 'center',
        width: '33%',
        justifyContent: 'space-between'
    },
    tile: {
        width: '2em',
        height:'2em',
        border: '1px dashed',
        position:'relative' as 'relative',
        backgroundImage: 'url(./build'+require('../../assets/whiteTile.png')+')',
        backgroundRepeat: 'repeat'
    },
}