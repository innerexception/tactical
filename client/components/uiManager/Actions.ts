const Constants = require("../../../Constants")

export const setUser = (currentUser:object) => {
    return {
        type: Constants.ReducerActions.SET_USER,
        currentUser
    }
}

export const initServer = (props:object) => {
    return {
        type: Constants.ReducerActions.INIT_SERVER,
        props
    }
}

export const connected = () => {
    return {
        type: Constants.ReducerActions.CONNECTED
    }
}

export const connectionError = () => {
    return {
        type: Constants.ReducerActions.CONNECTION_ERROR
    }
}

export const decodeWSMessage = (data:any) => {
    if (!data ) {
      return {
          type:'noop'
      }
    }
    var payload = JSON.parse(data.data);
    return {...payload}
}

