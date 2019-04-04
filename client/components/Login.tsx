import * as React from 'react';
import { onLogin } from './uiManager/Thunks'
import AppStyles from '../AppStyles';

export default class Login extends React.Component {
    state = { name: '', sessionId: ''}

    render(){
        return (
            <div>
                <div style={styles.loginFrame}>
                    <h2 style={{textAlign:'center', margin:0}}>MacTactics</h2>
                    <hr/>
                    <h3 style={{margin:'0'}}>Handle</h3>
                    <input style={{...styles.loginInput, marginBottom:'0.5em'}} type="text" value={this.state.name} onChange={(e)=>this.setState({name:e.currentTarget.value})}/>
                    <h3 style={{margin:'0'}}>Match Name</h3>
                    <input style={{...styles.loginInput, marginBottom:'1em'}} type="text" value={this.state.sessionId} onChange={(e)=>this.setState({sessionId:e.currentTarget.value})}/>
                    <div style={styles.login} 
                         onClick={()=>onLogin(getUser(this.state.name), this.state.sessionId)}>
                         <div style={{border:'1px solid', borderRadius: '3px', opacity: this.state.name && this.state.sessionId ? 1 : 0.5}}>Ok</div>
                    </div>
                </div>
            </div>
        )
    }
}

const getUser = (name:string) => {
   return {name,id: Date.now() + ''+ Math.random()}
}

const styles = {
    loginFrame: {
        background: AppStyles.colors.white,
        borderRadius: '5px',
        border: '1px solid',
        padding:'0.5em'
    },
    loginInput: {
        boxShadow: 'none',
        border: '1px solid'
    },
    login: {
        color:AppStyles.colors.black, 
        cursor:'pointer',
        textAlign:'center' as 'center',
        border: '3px solid',
        borderRadius: '5px',
        background:'white',
        width:'50%',
        marginLeft:'50%',
        padding:'2px'
    }
}