import * as React from 'react'
import { onMatchTick, onPlayerReady } from '../uiManager/Thunks'
import { Button, Card, Dialog, Tooltip, Position, Icon, Drawer, RadioGroup, Popover } from '@blueprintjs/core'
import AppStyles from '../../AppStyles';
import Map from './Map'
import { MatchStatus } from '../../../enum';

interface Props {
    currentUser: LocalUser
    activeSession: Session
}

interface State {
    isActive: boolean
    interval: NodeJS.Timeout | number
    showMatchOptions: boolean
    army: Array<Unit>
}

export default class Match extends React.Component<Props, State> {

    state = {
        interval: 0,
        isActive: false,
        showMatchOptions: false,
        army: Array<Unit>()
    }

    componentDidMount = () => {
        this.setState({interval: this.state.isActive ? setInterval(()=>this.checkTimer(), 1000) : 0})
    }

    endTurn = () => {
        clearInterval(this.state.interval)
        // onEndTurn(this.props.currentUser, this.props.activeSession)
    }

    setPlayerReady = () => {
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
                     activePlayer={activePlayer}
                     players={this.props.activeSession.players}/>
                <Drawer
                    isOpen={this.state.showMatchOptions}
                    style={AppStyles.modal}
                    onClose={() => this.setState({ showMatchOptions: false })}
                >
                    <div style={{display:'flex'}}>
                        options menu
                    </div>
                </Drawer>
                <Drawer
                    isOpen={this.props.activeSession.status === MatchStatus.SETUP}
                    style={AppStyles.modal}
                >
                    <div style={{display:'flex'}}>
                        army builder
                        <button onClick={()=>this.setPlayerReady()}>Done</button>
                    </div>
                </Drawer>
            </div>
        )
    }
}

const styles = {
    frame: {
        padding:'1em',
        position:'relative' as 'relative'
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