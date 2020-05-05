import {updateObject} from "../utillity";
import * as actionTypes from '../actions/actionTypes';

const initialState = {
    roomInfo: null,
    error: null,
    loading: false,
    payment: false
}

const orderRoomStart = (state, action) => {
    return updateObject(state, {
       error: null,
       loading: true
    });
}

const orderRoomSuccess = (state, action) => {
    return updateObject(state, {
        roomInfo: action.data,
        error: null,
        loading: false,
        payment: false,
    })
}

// When user paid order
const orderRoomSuccessAndFinished = (state, action) => {
    return updateObject(state, {
        roomInfo: action.data,
        error: null,
        loading: false,
        payment: true
    })
}

const orderRoomFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
        payment: false
    })
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.ORDER_ROOM_START: return orderRoomStart(state, action);
        case actionTypes.ORDER_ROOM_FAIL: return orderRoomFail(state, action);
        case actionTypes.ORDER_ROOM_SUCCESS: return orderRoomSuccess(state, action);
        case actionTypes.ORDER_ROOM_SUCCESS_AND_PAID: return orderRoomSuccessAndFinished(state,action);
        default:
            return state;
    }
}

export default reducer;