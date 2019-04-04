import * as React from 'react';
import { onLogin } from './uiManager/Thunks'
import AppStyles from '../AppStyles';

export default class Login extends React.Component {
    state = { name: '', sessionId: ''}

    render(){
        return (
            <div>
                <div style={AppStyles.window}>
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

export const Button = (enabled:boolean, handler:any, text:string) => 
    <div style={{...AppStyles.buttonOuter, pointerEvents: enabled ? 'all' : 'none'}} 
         onClick={handler}>
        <div style={{border:'1px solid', borderRadius: '3px', opacity: enabled ? 1 : 0.5, }}>{text}</div>
    </div>

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