import * as actionTypes from './actionTypes';
import axios from 'axios';
import {authAxios} from "../../utils";
import {locationDetail} from "../../constants";


export const locationStart = () => {
    return {
        type: actionTypes.LOCATION_START
    }
}

export const locationFail = (error) => {
    return {
        type: actionTypes.LOCATION_FAIL,
        error: error
    }
}

export const locationSuccess = (position) => {
    return {
        type: actionTypes.LOCATION_SUCCESS,
        position
    }
}

export const fetchLocation = (user) => {
    return dispatch => {
        dispatch(locationStart());
        authAxios
            .get(locationDetail(user))
            .then(res => {
                dispatch(locationSuccess(res.data))
            })
            .catch(err => {
                if (err.status.code === 404){
                    const geolocation = navigator.geolocation;
                    geolocation.getCurrentPosition((position => {
                        console.log(position.coords);
                        const coordinate = position.coords.latitude + ' ' + position.coords.longitude;
                        authAxios
                            .post(locationDetail(user),{point: coordinate})
                            .then(res => {
                                dispatch(locationSuccess(res.data))
                            })
                            .catch(error => {
                                dispatch(locationFail(error));
                            })
                    }))
                }else{
                    dispatch(locationFail(err));
                }
            });
    };
};