import * as React from 'react'
import { onMatchTick, onPlayerReady } from '../uiManager/Thunks'
import { Button, Card, Dialog, Tooltip, NumericInput, Icon, Drawer, Radio, RadioGroup, Popover } from '@blueprintjs/core'
import AppStyles from '../../AppStyles';
import Map from './Map'
import { MatchStatus, UnitType, Army, Units } from '../../../enum';
import { arrayLengthCompare } from '@blueprintjs/core/lib/esm/common/utils';

interface Props {
    currentUser: LocalUser
    activeSession: Session
}

interface State {
    isActive: boolean
    interval: NodeJS.Timeout | number
    showMatchOptions: boolean
    army: Array<Unit>
    armyType: Army
    points: number
}

export default class Match extends React.Component<Props, State> {

    state = {
        interval: 0,
        isActive: false,
        showMatchOptions: false,
        army: Array<Unit>(),
        armyType: Army.LIVING,
        points: 30
    }

    componentDidMount = () => {
        this.setState({interval: this.state.isActive ? setInterval(()=>this.checkTimer(), 1000) : 0})
    }

    endTurn = () => {
        clearInterval(this.state.interval)
        // onEndTurn(this.props.currentUser, this.props.activeSession)
    }

    setUnitTypeCount = (count:number, type:UnitType) => {
        let army = this.state.army.filter((unit) => unit.type !== type)
        army = army.concat(new Array(count).fill(
            {...Units[this.state.armyType].find((unit) => unit.type === type)}
        ))
        this.setState({army, points: 30 - this.getArmyValue(army)})
    }

    getArmyValue = (army:Array<Unit>) => {
        let cost = 0
        army.forEach((unit) => cost+=unit.cost)
        return cost
    }

    setPlayerReady = () => {
        this.state.army = this.state.army.map((unit, i) => {
            return {
                ...unit,
                x:i,
                y:0,
                id: Date.now()+''+Math.random(),
                ownerId: this.props.currentUser.id
            }
        })
        onPlayerReady(this.props.currentUser, this.state.army, this.props.activeSession)
    }

    checkTimer = () => {
        if(this.props.activeSession.ticks >= this.props.activeSession.turnTickLimit){
            this.endTurn()
        }
        else onMatchTick(this.props.activeSession)
    }

    render(){

        const activePlayer = this.props.activeSession.players.find((player) => player.id === this.props.activeSession.activePlayerId)
        const me = this.props.activeSession.players.find((player) => this.props.currentUser.id === player.id)

        return (
            <div style={styles.frame}>
                <Map map={this.props.activeSession.map} 
                     activePlayer={me}
                     activeSession={this.props.activeSession}
                     players={this.props.activeSession.players}/>
                <Drawer
                    isOpen={this.state.showMatchOptions}
                    style={styles.drawer}
                    onClose={() => this.setState({ showMatchOptions: false })}
                >
                    <div style={{display:'flex'}}>
                        options menu
                    </div>
                </Drawer>
                <Drawer
                    isOpen={this.props.activeSession.status === MatchStatus.SETUP}
                    style={styles.drawer}
                >
                    <div>
                        <RadioGroup
                            inline
                            label="Army"
                            onChange={(e)=>this.setState({armyType: e.currentTarget.value as Army, points: 30, army: []})}
                            selectedValue={this.state.armyType}
                        >
                            <Radio label="Living" value={Army.LIVING} />
                            <Radio label="Dead" value={Army.DEAD} />
                        </RadioGroup>
                        <h4>Available: {this.state.points}</h4>
                        {Units[this.state.armyType].map((unit) => 
                            <div style={{display:'flex'}}>
                                <div>
                                    <div>{getUnitCount(this.state.army, unit.type)}</div>
                                    <div>{unit.name}</div>
                                    <div style={{fontFamily:'Rune', fontSize:'1em'}}>{unit.rune}</div>
                                </div>
                                <div style={styles.circleButton} onClick={()=>this.setUnitTypeCount(getUnitCount(this.state.army, unit.type)+1, unit.type)}>+</div>
                                <div style={styles.circleButton} onClick={()=>this.setUnitTypeCount(getUnitCount(this.state.army, unit.type)-1, unit.type)}>-</div>
                            </div>
                        )}
                        <button onClick={()=>this.setPlayerReady()}>Done</button>
                    </div>
                </Drawer>
            </div>
        )
    }
}

const getUnitCount = (army:Array<Unit>, unitType:UnitType) => army.filter((aunit)=>aunit.type === unitType).length

const styles = {
    frame: {
        padding:'1em',
        position:'relative' as 'relative'
    },
    drawer: {
        height:'100%',
        padding:'1em',
        backgroundImage: 'url(./build'+require('../../assets/basemap.jpg')+')',
        backgroundPosition:'center',
        backgroundRepeat: 'no-repeat'
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
    emptyFundSpot: {},
    roleCard: {}
}