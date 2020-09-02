import * as actionTypes from '../actionTypes';
import {authAxios} from '../../../utils';
import {axios} from 'axios';
import {addToCartUrl, deleteCartItemUrl, updateCartItemUrl,
        myCartUrl, productDetailUrl} from '../../../constants';


export function fetchCart(username){
    return async dispatch => {
        dispatch(request());
        try {
            const myCart = await (authAxios().get(myCartUrl(username)));
            const response = myCart.data
            dispatch(succes(response));
            return response;
        } catch (err) {
            dispatch(failure(err.message));
        }
    }

    function request() {
        return {type: actionTypes.REQUEST_CART};
    };

    function succes(cart) {
        return {type: actionTypes.SUCCESS_CART, cart};
    };

    function failure(error) {
        return {type: actionTypes.FAILURE_CART, error};
    };
};

export function fetchProduct(productId) {
    return async dispatch => {
        dispatch(request());
        try {
            const product = await (authAxios().get(productDetailUrl(productId)));
            const response = product.data;
            dispatch(success(response));
        } catch (err) {
            dispatch(failure(err.message));
        }
    };

    function request() {
        return {type: actionTypes.REQUEST_FETCH_PRODUCT};
    };

    function success(product) {
        return {type: actionTypes.SUCCESS_FETCH_PRODUCT, product};
    };

    function failure(error) {
        return {type: actionTypes.FAILURE_FETCH_PRODUCT, error};
    };
};

export function addProductToCart(productId, productName, productCount){
    return async dispatch => {
        dispatch(request());
        try {
            const purchasedProduct = await authAxios().post(addToCartUrl(productId),
                {product_name: productName,
                count: productCount});
            const messageResponse = purchasedProduct.data;
            dispatch(success(messageResponse));
            window.location.reload(false);
        } catch(err) {
            dispatch(failure(err));
        }
    };

    function request() {
        return {type: actionTypes.REQUEST_BUYING};
    };

    function success(messageSuccess) {
        return {type: actionTypes.SUCCESS_BUYING, messageSuccess};
    };

    function failure(error) {
        return {type: actionTypes.FAILURE_BUYING, error};
    };
}

export function removeProductFromCart(productId){
    return async dispatch => {
        dispatch(request());
        try {
            const removedProduct = await (authAxios().delete(deleteCartItemUrl(productId)));
            const messageResponse = removedProduct.data.message;
            dispatch(success(messageResponse));
            window.location.reload(false);
        } catch(err) {
            dispatch(failure(err.message));
        }
    }

    function request() {
        return {type: actionTypes.REQUEST_REMOVE_FROM_CART};
    };

    function success(messageSuccess) {
        return {type: actionTypes.SUCCESS_REMOVE_FROM_CART, messageSuccess};
    }

    function failure(error) {
        return {type: actionTypes.FAILURE_REMOVE_FROM_CART, error};
    }
};

export function updateProductInCart(productId, productName, newCountProduct) {
    return async dispatch => {
        dispatch(request());
        try {
            const requestData = {
                product_name: productName,
                count: newCountProduct
            };
            const updatedProduct = await (authAxios().put(updateCartItemUrl(productId),
                requestData))
            const messageResponse = updatedProduct.data.message;
            dispatch(success(messageResponse));
            window.location.reload(false);
        } catch (err) {
            dispatch(failure(err.message));
        }
    };

    function request() {
        return {type: actionTypes.REQUEST_UPDATE_PRODUCT_IN_CART};
    };

    function success(message) {
        return {type: actionTypes.SUCCESS_UPDATE_PRODUCT_IN_CART, message};
    };

    function failure(error) {
        return {type: actionTypes.FAILURE_UPDATE_PRODUCT_IN_CART, error};
    };
}