import {CART_START,
        CART_SUCCESS,
        CART_FAIL 
} from './actionTypes';
import { authAxios } from '../../utils';
import { myCartUrl } from '../../constants';


export const cartStart = () => {
    return {
        type: CART_START
    };
};

export const cartFail = (error) => {
    return {
        type: CART_FAIL,
        error: error
    };
};

export const cartSuccess = cart => {
    return {
        type: CART_SUCCESS,
        cart
    }
};

export const fetchCart = () => {
    return dispatch => {
        dispatch(cartStart());
        authAxios
            .get(myCartUrl)
                .then(res => {
                    dispatch(cartSuccess(res.data));
                })
                .catch(err => {
                    dispatch(cartFail(err));
                });
    };
};
