"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var actionTypes = _interopRequireWildcard(require("../../actions/actionTypes"));

var _utillity = require("../../utillity");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var initialState = {
  token: null,
  refreshToken: null,
  error: null,
  loading: false,
  username: null,
  expirationDate: null,
  is_staff: null,
  refreshingPromise: null
};

var authStart = function authStart(state, action) {
  return (0, _utillity.updateObject)(state, {
    error: null,
    loading: true
  });
};

var authSuccess = function authSuccess(state, action) {
  return (0, _utillity.updateObject)(state, {
    token: action.token,
    refreshToken: action.refreshToken,
    expirationDate: action.expirationDate,
    is_staff: action.is_staff,
    username: action.username,
    error: null,
    loading: false
  });
};

var authFail = function authFail(state, action) {
  return (0, _utillity.updateObject)(state, {
    error: action.error,
    loading: false
  });
};

var authLogout = function authLogout(state, action) {
  return (0, _utillity.updateObject)(state, {
    token: null,
    refreshToken: null,
    username: null,
    is_staff: null,
    expirationDate: null
  });
};

var authRefreshingToken = function authRefreshingToken(state, action) {
  return (0, _utillity.updateObject)(state, {
    refreshingPromise: action.refreshingPromise
  });
};

var authDoneRefreshingToken = function authDoneRefreshingToken(state, action) {
  return (0, _utillity.updateObject)(state, {
    refreshingPromise: null
  });
};

var authUpdateToken = function authUpdateToken(state, action) {
  return (0, _utillity.updateObject)(state, {
    username: action.username,
    token: action.token,
    refreshToken: action.refreshToken,
    expirationDate: action.expirationDate,
    is_staff: action.is_staff
  });
};

var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);

    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);

    case actionTypes.AUTH_FAIL:
      return authFail(state, action);

    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);

    case actionTypes.AUTH_REFRESHING_TOKEN:
      return authRefreshingToken(state, action);

    case actionTypes.AUTH_DONE_REFRESHING_TOKEN:
      return authDoneRefreshingToken(state, action);

    case actionTypes.AUTH_UPDATE_TOKEN:
      return authUpdateToken(state, action);

    default:
      return state;
  }
};

var _default = reducer;
exports["default"] = _default;