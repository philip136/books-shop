import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utillity';


const initialState = {
    token: null,
    error: null,
    loading: false
}

const authStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: false
    });
}

const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,
        error: null,
        loading: false
    });
}

const authFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
}

const authLogout = (state, action) => {
    return updateObject(state, {
        token: null
    });
}

const reducer = (state=initialState, action) => {
    switch(action.type){
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authStart(state, action);
        case actionTypes.AUTH_FAIL: return authStart(state, action);
        case actionTypes.AUTH_LOGOUT: return authStart(state, action);
        default:
            return state;
    }
}

export default reducer;