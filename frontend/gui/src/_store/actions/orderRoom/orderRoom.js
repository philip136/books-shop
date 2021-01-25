import * as actionTypes from '../actionTypes';
import {authAxios} from "../../../utils";
import {closeOrderUrl, orderRoomUrl} from "../../../constants";
import WebSocketInstance from "../../../websocket";

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

export const closeOrderSuccess = roomId => {
    return { 
        type: actionTypes.CLOSE_ORDER,
        roomId: roomId
     };
}

export const getUserRoom = (id) => {
    return dispatch => {
        authAxios()
        .get(orderRoomUrl(id))
        .then(res => {
            dispatch(getUserRoomSuccess(res.data));
        })
        .catch(err => {
            console.log(err);
        });
    };
};

export const closeOrder = (id) => {
    return dispatch => {
        authAxios().delete(closeOrderUrl(id))
        .then(() => {
            WebSocketInstance.closeOrder(id);
            dispatch(closeOrderSuccess(id));
        });
    };
};
