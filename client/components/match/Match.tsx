import * as React from 'react'
import { onMatchTick, onPlayerReady, onEndTurn } from '../uiManager/Thunks'
import { Radio, RadioGroup } from '@blueprintjs/core'
import { Button } from '../Shared'
import AppStyles from '../../AppStyles';
import Map from './Map'
import { MatchStatus, UnitType, Army, Units } from '../../../enum';
import { TopBar } from '../Shared'
import ArmyBuilder from './ArmyBuilder';

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
    me: Player
}

export default class Match extends React.Component<Props, State> {

    state = {
        interval: 0,
        isActive: this.props.activeSession.activePlayerId === this.props.currentUser.id,
        me: this.props.activeSession.players.find(player=>player.id===this.props.currentUser.id),
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
        onEndTurn(this.props.activeSession)
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
                y:0, //TODO x/y should be set by player somehow
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
            <div style={AppStyles.window}>
                {TopBar('MacTactics')}
                <div style={{padding:'0.5em'}}>
                    <Map map={this.props.activeSession.map} 
                        activePlayer={me}
                        activeSession={this.props.activeSession}
                        players={this.props.activeSession.players}/>
                    <div style={{...styles.modal, display: this.state.showMatchOptions ? 'flex':'none'}}>
                        <div style={{display:'flex'}}>
                            options menu
                        </div>
                    </div>
                    <ArmyBuilder activeSession={this.props.activeSession} me={me}/>
                </div>
         </div>
        )
    }
}

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
    }
}