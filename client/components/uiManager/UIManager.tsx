import * as React from 'react';
import Lobby from '../Lobby'
import Match from '../match/Match'
import Login from '../Login'
import Editor from  '../Editor'
import AppStyles from '../../AppStyles';

interface Props {
    onInitServer: Function
    currentUser: LocalUser
    activeSession: Session
    isConnected: boolean
}

export default class UIManager extends React.Component<Props> {

    componentDidMount(){
        this.props.onInitServer(this.props)
    }

    getComponent = () => {
        if(!this.props.currentUser.id){
            return <Login {...this.props}/>
        }
        else {
            if(this.props.currentUser.name === 'admin'){
                return <Editor {...this.props}/>
            }
            if(this.props.activeSession && !this.props.activeSession.status){
                return <Lobby {...this.props}/>
            }
            if(this.props.activeSession && this.props.activeSession.status){
                return <Match {...this.props}/>
            }
        }
    }

    render(){
        return (
            <div style={styles.frame}>
                {this.getComponent()}
                <div style={styles.statusDot}>
                    <h6 style={{margin:0, marginRight:'0.5em'}}>Servers are</h6>
                    <h6 style={{margin:0, color: this.props.isConnected ? AppStyles.colors.black: AppStyles.colors.white}}>{this.props.isConnected ? 'Up' : 'Down'}</h6>    
                </div>
            </div>
        )
    }
}

const styles = {
    frame: {
        height: '100vh',
        display:'flex', justifyContent:'center', alignItems:'center',
        backgroundImage: 'url('+require('../../assets/tiny.png')+')',
        backgroundRepeat: 'repeat'
    },
    dot: {
        height:'0.5em',
        width:'0.5em',
        borderRadius: '0.5em'
    },
    statusDot: {
        position:'absolute' as 'absolute', bottom:'0.5em', right:'0.5em',
        display:'flex',
        color:AppStyles.colors.black,
        alignItems:'center'
    }
}