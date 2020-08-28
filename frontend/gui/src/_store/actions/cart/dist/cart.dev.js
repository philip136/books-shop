"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchCart = fetchCart;
exports.fetchProduct = fetchProduct;
exports.addProductToCart = addProductToCart;
exports.removeProductFromCart = removeProductFromCart;
exports.updateProductInCart = updateProductInCart;

var actionTypes = _interopRequireWildcard(require("../actionTypes"));

var _utils = require("../../../utils");

var _axios = require("axios");

var _constants = require("../../../constants");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function fetchCart(username) {
  return function _callee(dispatch) {
    var myCart, response;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            dispatch(request());
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap(_utils.authAxios.get((0, _constants.myCartUrl)(username)));

          case 4:
            myCart = _context.sent;
            response = myCart.data;
            dispatch(succes(response));
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](1);
            dispatch(failure(_context.t0.message));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 9]]);
  };

  function request() {
    return {
      type: actionTypes.REQUEST_CART
    };
  }

  ;

  function succes(cart) {
    return {
      type: actionTypes.SUCCESS_CART,
      cart: cart
    };
  }

  ;

  function failure(error) {
    return {
      type: actionTypes.FAILURE_CART,
      error: error
    };
  }

  ;
}

;

function fetchProduct(productId) {
  return function _callee2(dispatch) {
    var product, response;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            dispatch(request());
            _context2.prev = 1;
            _context2.next = 4;
            return regeneratorRuntime.awrap((0, _utils.authAxios)().get((0, _constants.productDetailUrl)(productId)));

          case 4:
            product = _context2.sent;
            response = product.data;
            dispatch(success(response));
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](1);
            dispatch(failure(_context2.t0.message));

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[1, 9]]);
  };

  function request() {
    return {
      type: actionTypes.REQUEST_FETCH_PRODUCT
    };
  }

  ;

  function success(product) {
    return {
      type: actionTypes.SUCCESS_FETCH_PRODUCT,
      product: product
    };
  }

  ;

  function failure(error) {
    return {
      type: actionTypes.FAILURE_FETCH_PRODUCT,
      error: error
    };
  }

  ;
}

;

function addProductToCart(productId, productName, productCount) {
  return function _callee3(dispatch) {
    var purchasedProduct, messageResponse;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            dispatch(request());
            _context3.prev = 1;
            _context3.next = 4;
            return regeneratorRuntime.awrap((0, _utils.authAxios)().post((0, _constants.addToCartUrl)(productId), {
              product_name: productName,
              count: productCount
            }));

          case 4:
            purchasedProduct = _context3.sent;
            messageResponse = purchasedProduct.data;
            dispatch(success(messageResponse));
            dispatch(fetchProduct(productId));
            _context3.next = 13;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](1);
            dispatch(failure(_context3.t0));

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[1, 10]]);
  };

  function request() {
    return {
      type: actionTypes.REQUEST_BUYING
    };
  }

  ;

  function success(messageSuccess) {
    return {
      type: actionTypes.SUCCESS_BUYING,
      messageSuccess: messageSuccess
    };
  }

  ;

  function failure(error) {
    return {
      type: actionTypes.FAILURE_BUYING,
      error: error
    };
  }

  ;
}

function removeProductFromCart(productId) {
  return function _callee4(dispatch) {
    var removedProduct, messageResponse;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            dispatch(request());
            _context4.prev = 1;
            _context4.next = 4;
            return regeneratorRuntime.awrap(_utils.authAxios["delete"]((0, _constants.deleteCartItemUrl)(productId)));

          case 4:
            removedProduct = _context4.sent;
            messageResponse = removedProduct.data.message;
            dispatch(success(messageResponse));
            _context4.next = 12;
            break;

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](1);
            dispatch(failure(_context4.t0.message));

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[1, 9]]);
  };

  function request() {
    return {
      type: actionTypes.REQUEST_REMOVE_FROM_CART
    };
  }

  ;

  function success(messageSuccess) {
    return {
      type: actionTypes.SUCCESS_REMOVE_FROM_CART,
      messageSuccess: messageSuccess
    };
  }

  function failure(error) {
    return {
      type: actionTypes.FAILURE_REMOVE_FROM_CART,
      error: error
    };
  }
}

;

function updateProductInCart(productId, newCountProduct) {
  return function _callee5(dispatch) {
    var updatedProduct, messageResponse;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            dispatch(request());
            _context5.prev = 1;
            _context5.next = 4;
            return regeneratorRuntime.awrap((_utils.authAxios.put((0, _constants.updateCartItemUrl)(productId)), {
              newCountProduct: newCountProduct
            }));

          case 4:
            updatedProduct = _context5.sent;
            messageResponse = updatedProduct.data.message;
            dispatch(success(messageResponse));
            _context5.next = 12;
            break;

          case 9:
            _context5.prev = 9;
            _context5.t0 = _context5["catch"](1);
            dispatch(failure(_context5.t0.message));

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[1, 9]]);
  };

  function request() {
    return {
      type: actionTypes.REQUEST_UPDATE_PRODUCT_IN_CART
    };
  }

  ;

  function success(message) {
    return {
      type: actionTypes.SUCCESS_UPDATE_PRODUCT_IN_CART,
      message: message
    };
  }

  ;

  function failure(error) {
    return {
      type: actionTypes.FAILURE_UPDATE_PRODUCT_IN_CART,
      error: error
    };
  }

  ;
}