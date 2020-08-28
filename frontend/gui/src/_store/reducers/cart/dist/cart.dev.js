"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = cartReducer;

var _utillity = require("../../utillity");

var _actionTypes = require("../../actions/actionTypes");

var initialState = {
  confirming: false,
  declining: false,
  error: null,
  loading: false,
  message: null,
  cart: null,
  product: null
};

var requestToBuyingProduct = function requestToBuyingProduct(state, action) {
  return (0, _utillity.updateObject)(state, {
    error: null,
    loading: true
  });
};

var successBuyingProduct = function successBuyingProduct(state, action) {
  console.log(state, action);
  return (0, _utillity.updateObject)(state, {
    confirming: true,
    declining: false,
    loading: false,
    message: action.message
  });
};

var failureBuyingProduct = function failureBuyingProduct(state, action) {
  console.log(state, action);
  return (0, _utillity.updateObject)(state, {
    confirming: false,
    declining: true,
    loading: false,
    error: action.error
  });
};

var requestRemoveFromCart = function requestRemoveFromCart(state, action) {
  return (0, _utillity.updateObject)(state, {
    error: null,
    loading: true
  });
};

var successRemoveFromCart = function successRemoveFromCart(state, action) {
  return (0, _utillity.updateObject)(state, {
    confirming: true,
    declining: false,
    loading: false,
    message: action.message
  });
};

var failureRemoveFromCart = function failureRemoveFromCart(state, action) {
  return (0, _utillity.updateObject)(state, {
    confirming: false,
    declining: true,
    loading: false,
    error: action.error
  });
};

var requestUpdateInCart = function requestUpdateInCart(state, action) {
  return (0, _utillity.updateObject)(state, {
    error: null,
    loading: true
  });
};

var successUpdateInCart = function successUpdateInCart(state, action) {
  return (0, _utillity.updateObject)(state, {
    confirming: true,
    declining: false,
    loading: false,
    message: action.message
  });
};

var failureUpdateInCart = function failureUpdateInCart(state, action) {
  return (0, _utillity.updateObject)(state, {
    confirming: false,
    declining: true,
    loading: false,
    error: action.error
  });
};

var requestCart = function requestCart(state, action) {
  return (0, _utillity.updateObject)(state, {
    error: null,
    loading: true
  });
};

var successCart = function successCart(state, action) {
  return (0, _utillity.updateObject)(state, {
    confirming: true,
    declining: false,
    loading: false,
    cart: action.cart
  });
};

var failureCart = function failureCart(state, action) {
  return (0, _utillity.updateObject)(state, {
    confirming: false,
    declining: true,
    loading: false,
    error: action.error
  });
};

var requestFetchProduct = function requestFetchProduct(state, action) {
  return (0, _utillity.updateObject)(state, {
    loading: true,
    error: null
  });
};

var successFetchProduct = function successFetchProduct(state, action) {
  return (0, _utillity.updateObject)(state, {
    loading: false,
    product: action.product
  });
};

var failureFetchProduct = function failureFetchProduct(state, action) {
  return (0, _utillity.updateObject)(state, {
    loading: false,
    error: action.error
  });
};

function cartReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _actionTypes.REQUEST_BUYING:
      return requestToBuyingProduct(state, action);

    case _actionTypes.SUCCESS_BUYING:
      return successBuyingProduct(state, action);

    case _actionTypes.FAILURE_BUYING:
      return failureBuyingProduct(state, action);

    case _actionTypes.REQUEST_REMOVE_FROM_CART:
      return requestRemoveFromCart(state, action);

    case _actionTypes.SUCCESS_REMOVE_FROM_CART:
      return successRemoveFromCart(state, action);

    case _actionTypes.FAILURE_REMOVE_FROM_CART:
      return failureRemoveFromCart(state, action);

    case _actionTypes.REQUEST_UPDATE_PRODUCT_IN_CART:
      return requestUpdateInCart(state, action);

    case _actionTypes.SUCCESS_UPDATE_PRODUCT_IN_CART:
      return successUpdateInCart(state, action);

    case _actionTypes.FAILURE_UPDATE_PRODUCT_IN_CART:
      return failureUpdateInCart(state, action);

    case _actionTypes.REQUEST_CART:
      return requestCart(state, action);

    case _actionTypes.SUCCESS_CART:
      return successCart(state, action);

    case _actionTypes.FAILURE_CART:
      return failureCart(state, action);

    case _actionTypes.REQUEST_FETCH_PRODUCT:
      return requestFetchProduct(state, action);

    case _actionTypes.SUCCESS_FETCH_PRODUCT:
      return successFetchProduct(state, action);

    case _actionTypes.FAILURE_FETCH_PRODUCT:
      return failureFetchProduct(state, action);

    default:
      return state;
  }

  ;
}

;