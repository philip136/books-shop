import * as actionTypes from '../../actions/actionTypes';
import {updateObject} from '../../utillity';

const initialState = {
    token: null,
    refreshToken: null,
    error: null,
    loading: false,
    username: null,
    expirationDate: null,
    is_staff: null,
    refreshingPromise: null
}

const authStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true
    });
}

const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,
        refreshToken: action.refreshToken,
        expirationDate: action.expirationDate,
        is_staff: action.is_staff,
        username: action.username,
        error: null,
        loading: false,
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
        token: null,
        refreshToken: null,
        username: null,
        is_staff: null,
        expirationDate: null
    });
}

const authRefreshingToken = (state, action) => {
    return updateObject(state, {
        refreshingPromise: action.refreshingPromise
    });
}

const authDoneRefreshingToken = (state, action) => {
    return updateObject(state, {
        refreshingPromise: null
    });
}

const authUpdateToken = (state, action) => {
    return updateObject(state, {
        username: action.username,
        token: action.token,
        refreshToken: action.refreshToken,
        expirationDate: action.expirationDate,
        is_staff: action.is_staff
    });
}


const reducer = (state=initialState, action) => {
    switch(action.type){
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.AUTH_REFRESHING_TOKEN:
            return authRefreshingToken(state, action);
        case actionTypes.AUTH_DONE_REFRESHING_TOKEN:
            return authDoneRefreshingToken(state, action);
        case actionTypes.AUTH_UPDATE_TOKEN:
            return authUpdateToken(state, action);
        default:
            return state;
    }
}

export default reducer;