import * as React from 'react';
import { onMatchStart } from './uiManager/Thunks'

interface Props { 
    activeSession:Session
    currentUser:LocalUser
}

export default class Lobby extends React.Component<Props> {

    startMatch = () => {
        console.log(this.props)
        onMatchStart(
            this.props.currentUser, 
            this.props.activeSession)
    }

    getErrors = () => {
        return ''
        if(this.props.activeSession.players.length < 2) return 'Waiting for more to join...'
    }

    render(){
        return (
            <div style={{width:'100%'}}>
                <div style={{padding:'1em'}}>Assembling at {this.props.activeSession.sessionId}'s HQ</div>
                <div style={{padding:'1em', display:'flex', alignItems:'center', overflowX:'auto'}}>
                    {this.props.activeSession.players.map((player:Player) => 
                        <div style={styles.nameTag}>
                            <input style={styles.loginInput} type="text" value={player.name}/>
                        </div>
                    )}
                </div>
                <div>{this.getErrors()}</div>
                {this.getErrors() ? '' : <div style={{cursor:'pointer', margin:'1em', textAlign:'right'}} onClick={this.startMatch}>Start Extracting -></div>}
            </div>
        )
    }
}

const styles = {
    nameTag: {
        background: 'red',
        borderRadius: '0.5em',
        color: 'white',
        pointerEvents:'none' as 'none',
        width:'13em',
        marginRight:'1em'
    },
    loginInput: {
        boxShadow: 'none',
        border: 'none',
        padding: '0.5em',
        marginBottom:'1em',
        marginTop:'1em'
    }
}