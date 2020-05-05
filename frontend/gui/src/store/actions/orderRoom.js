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
    return dispatch => {
        dispatch(orderRoomStart());
        authAxios
            .get(orderRoomUrl(id))
            .then(res => {
                dispatch(orderRoomSuccess(res.data));
            })
            .catch(err => {
                dispatch(orderRoomFail(err));
            });
    };
};

export const deleteOrderRoom = (id) => {
    // api for delete room
}