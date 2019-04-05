import * as React from 'react';
import { onLogin } from './uiManager/Thunks'
import AppStyles from '../AppStyles';
import { Button } from './Shared'

export default class Login extends React.Component {
    state = { name: '', sessionId: ''}

    render(){
        return (
            <div>
                <div style={{...AppStyles.window, padding:'0.5em'}}>
                    <h2 style={{textAlign:'center', margin:0}}>MacTactics</h2>
                    <hr/>
                    <h3 style={{margin:'0'}}>Handle</h3>
                    <input style={{...styles.loginInput, marginBottom:'0.5em'}} type="text" value={this.state.name} onChange={(e)=>this.setState({name:e.currentTarget.value})}/>
                    <h3 style={{margin:'0'}}>Match Name</h3>
                    <input style={{...styles.loginInput, marginBottom:'1em'}} type="text" value={this.state.sessionId} onChange={(e)=>this.setState({sessionId:e.currentTarget.value})}/>
                    {Button(this.state.name && this.state.sessionId as any, ()=>onLogin(getUser(this.state.name), this.state.sessionId), 'Ok')}
                </div>
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
        border: '1px solid',
        minWidth:'10em'
    }
}