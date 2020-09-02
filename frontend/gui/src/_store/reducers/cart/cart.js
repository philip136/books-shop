import {updateObject} from '../../utillity';
import {REQUEST_BUYING, SUCCESS_BUYING, FAILURE_BUYING,
        REQUEST_REMOVE_FROM_CART, SUCCESS_REMOVE_FROM_CART, FAILURE_REMOVE_FROM_CART,
        REQUEST_UPDATE_PRODUCT_IN_CART, SUCCESS_UPDATE_PRODUCT_IN_CART, 
        FAILURE_UPDATE_PRODUCT_IN_CART, REQUEST_CART, SUCCESS_CART, FAILURE_CART,
        REQUEST_FETCH_PRODUCT, SUCCESS_FETCH_PRODUCT, FAILURE_FETCH_PRODUCT
} from '../../actions/actionTypes';


const initialState = {
    confirming: false,
    declining: false,
    error: null,
    loading: false,
    message: null,
    cart: null,
    product: null,
};

const requestToBuyingProduct = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true
    });
};

const successBuyingProduct = (state, action) => {
    console.log(state, action);
    return updateObject(state, {
        confirming: true,
        declining: false,
        loading: false,
        message: action.message
    });
};

const failureBuyingProduct = (state, action) => {
    console.log(state, action);
    return updateObject(state, {
        confirming: false,
        declining: true,
        loading: false,
        error: action.error
    });
};

const requestRemoveFromCart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const successRemoveFromCart = (state, action) => {
    return updateObject(state, {
        confirming: true,
        declining: false,
        loading: false,
        message: action.message,
    });
};

const failureRemoveFromCart = (state, action) => {
    return updateObject(state, {
        confirming: false,
        declining: true,
        loading: false,
        error: action.error
    });
};

const requestUpdateInCart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true,
        confirming: false,
    });
};

const successUpdateInCart = (state, action) => {
    return updateObject(state, {
        confirming: true,
        declining: false,
        loading: false,
        message: action.message,
        cart: action.cart
    });
};

const failureUpdateInCart = (state, action) => {
    return updateObject(state, {
        confirming: false,
        declining: true,
        loading: false,
        error: action.error
    });
};

const requestCart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const successCart = (state, action) => {
    return updateObject(state, {
        confirming: true,
        declining: false,
        loading: false,
        cart: action.cart
    });
};

const failureCart = (state, action) => {
    return updateObject(state, {
        confirming: false,
        declining: true,
        loading: false,
        error: action.error
    });
};

const requestFetchProduct = (state, action) => {
    return updateObject(state, {loading: true, error: null});
};

const successFetchProduct = (state, action) => {
    return updateObject(state, {loading: false, product: action.product});
};

const failureFetchProduct = (state, action) => {
    return updateObject(state, {loading: false,error: action.error});
};

export default function cartReducer(state=initialState, action) {
    switch(action.type) {
        case REQUEST_BUYING:
            return requestToBuyingProduct(state, action);
        case SUCCESS_BUYING:
            return successBuyingProduct(state, action);
        case FAILURE_BUYING:
            return failureBuyingProduct(state, action);
        case REQUEST_REMOVE_FROM_CART:
            return requestRemoveFromCart(state, action);
        case SUCCESS_REMOVE_FROM_CART:
            return successRemoveFromCart(state, action);
        case FAILURE_REMOVE_FROM_CART:
            return failureRemoveFromCart(state, action);
        case REQUEST_UPDATE_PRODUCT_IN_CART:
            return requestUpdateInCart(state, action);
        case SUCCESS_UPDATE_PRODUCT_IN_CART:
            return successUpdateInCart(state, action);
        case FAILURE_UPDATE_PRODUCT_IN_CART:
            return failureUpdateInCart(state, action);
        case REQUEST_CART:
            return requestCart(state, action);
        case SUCCESS_CART:
            return successCart(state, action);
        case FAILURE_CART:
            return failureCart(state, action);
        case REQUEST_FETCH_PRODUCT:
            return requestFetchProduct(state, action);
        case SUCCESS_FETCH_PRODUCT:
            return successFetchProduct(state, action);
        case FAILURE_FETCH_PRODUCT:
            return failureFetchProduct(state, action);
        default:
            return state;
    };
};
