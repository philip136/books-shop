import * as actionTypes from './actionTypes';
import axios from 'axios';
import {authAxios} from "../../utils";
import {orderRoomUrl} from "../../constants";


export const addLocation = location => {
    return {
        type: actionTypes.ADD_LOCATION,
        location: location
    };
};

export const setLocations = locations => {
    return {
        type: actionTypes.SET_LOCATIONS,
        locations: locations
    };
};

export const getUserRoomSuccess = room => {
    return {
        type: actionTypes.GET_ROOM_SUCCESS,
        room: room
    };
};

export const getUserRoom = (id) => {
    return dispatch => {
        authAxios()
        .get(orderRoomUrl(id))
        .then(res => dispatch(getUserRoomSuccess(res.data)));
    };
};

