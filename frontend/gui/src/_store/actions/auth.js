import * as actionTypes from './actionTypes';
import axios from 'axios';
import {registrationUrl, loginUrl, refreshTokenUrl} from "../../constants";


export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const updateToken = (token, refreshToken, username, expirationDate, is_staff) => {
    return {
        type: actionTypes.AUTH_UPDATE_TOKEN,
        token: token,
        refreshToken: refreshToken,
        username: username,
        expirationDate: expirationDate,
        is_staff: is_staff
    };
}

export const authSuccess = (token, refreshToken, username, expirationDate, is_staff) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        refreshToken: refreshToken,
        username: username,
        expirationDate: expirationDate,
        is_staff: is_staff
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const authRefresh = promise => {
    return {
        type: actionTypes.AUTH_REFRESHING_TOKEN,
        promise
    };
};

export const authDoneRefresh = () => {
    return {
        type: actionTypes.AUTH_DONE_REFRESHING_TOKEN
    };
};


export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('is_staff');
    localStorage.removeItem('username');
    localStorage.removeItem('expirationDate');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};


export const authSignup = (username, email, password1, password2, first_name, last_name) => {
    return dispatch => {
        dispatch(authStart());
        axios.post(registrationUrl, {
            username: username,
            email: email,
            password1: password1,
            password2: password2,
            first_name: first_name,
            last_name: last_name
        })
        .then(res => {
            const token = res.data.access;
            const refreshToken = res.data.refresh;
            const expirationDate = res.data.expirationDate;
            const is_staff = res.data.is_staff;
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('username', username);
            localStorage.setItem('expirationDate', expirationDate);
            dispatch(authSuccess(
                token, refreshToken, username, expirationDate, is_staff)
            );
        })
        .catch(err => {
            dispatch(authFail(err));
        });
    };
};

export const authLogin = (username, password) => {
    return dispatch => {
        dispatch(authStart());
        axios.post(loginUrl, {
            username: username,
            password: password
        })
        .then(res => {
            const token = res.data.access;
            const refreshToken = res.data.refresh;
            const expirationDate = res.data.expirationDate;
            const is_staff = res.data.is_staff;
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('is_staff', is_staff);
            localStorage.setItem('username', username);
            localStorage.setItem('expirationDate', expirationDate);
            dispatch(authSuccess(
                token, refreshToken, username, expirationDate, is_staff)
            );
        })
        .catch(err => {
            dispatch(authFail(err));
        });
    };
};

export const refreshToken = (dispatch, refresh) => {
    var refreshTokenPromise = axios.post(refreshTokenUrl, {refresh})
        .then(res => {
            const newToken = res.data.access;
            const newRefreshToken = res.data.refresh;
            const expirationDate = res.data.expirationDate;
            const username = localStorage.getItem("username");
            const is_staff = localStorage.getItem("is_staff");
            localStorage.setItem("token", newToken);
            localStorage.setItem("username", username);
            localStorage.setItem("is_staff", is_staff);
            localStorage.setItem("refreshToken", newRefreshToken);
            localStorage.setItem("expirationDate", expirationDate);
            dispatch({type: actionTypes.AUTH_DONE_REFRESHING_TOKEN});
            dispatch(updateToken(
                newToken, newRefreshToken, username, expirationDate, is_staff)
            );
            return Promise.resolve(newToken);
        })
        .catch(err => {
            dispatch({type: actionTypes.AUTH_DONE_REFRESHING_TOKEN});
            console.log('error refreshing token', err);
            dispatch(logout());
            return Promise.reject(err);
        });

    dispatch({
        type: actionTypes.AUTH_REFRESHING_TOKEN,
        refreshingPromise: refreshTokenPromise
    });

    return refreshTokenPromise;
};



