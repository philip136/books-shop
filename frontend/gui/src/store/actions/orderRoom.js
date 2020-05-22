import * as actionTypes from './actionTypes';
import axios from 'axios';
import {authAxios} from "../../utils";
import {orderRoomUrl} from "../../constants";


export const orderRoomStart = () => {
    return {
        type: actionTypes.ORDER_ROOM_START
    }
}

export const orderRoomFail = (error) => {
    return {
        type: actionTypes.ORDER_ROOM_FAIL,
        error: error
    }
}

export const orderRoomSuccess = (data) => {
    return {
        type: actionTypes.ORDER_ROOM_SUCCESS,
        data
    }
}

export const getRoom = (id) => {
    return async dispatch => {
        dispatch(orderRoomStart);
        try {
           const res = await authAxios.get(orderRoomUrl(id));
           dispatch(orderRoomSuccess(res.data));
        }
        catch(err) {
            dispatch(orderRoomFail(err));
        }
    };
};
