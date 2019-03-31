import * as React from 'react';
import { onLogin } from './uiManager/Thunks'

export default class Login extends React.Component {
    state = { name: '', sessionId: ''}

    render(){
        return (
            <div>
                <div style={styles.nameTag}>
                    <h2 style={{textAlign:'center', paddingTop:'0.25em'}}>Hi, My Name Is:</h2>
                    <input style={{...styles.loginInput, marginBottom:'0.5em'}} type="text" placeholder="Thought Leader" value={this.state.name} onChange={(e)=>this.setState({name:e.currentTarget.value})}/>
                    <h3 style={{textAlign:'center', paddingTop:'0.25em'}}>My Team Is:</h3>
                    <input style={{...styles.loginInput, marginBottom:'1em'}} type="text" placeholder="Smurf Party" value={this.state.sessionId} onChange={(e)=>this.setState({sessionId:e.currentTarget.value})}/>
                </div>
                {this.state.name && <div style={styles.login} onClick={()=>onLogin(getUser(this.state.name), this.state.sessionId)}>Go Do Buisness -></div>}
            </div>
        )
    }
}

const getUser = (name:string) => {
   return {name,id: Date.now() + ''+ Math.random()}
}

const styles = {
    loginInput: {
        boxShadow: 'none',
        border: 'none',
        padding: '1em',
    },
    nameTag: {
        background: 'red',
        borderRadius: '0.5em',
        color: 'white',
    },
    login: {color:'black', cursor:'pointer', textAlign:'right' as 'right', paddingTop:'1em'}
}