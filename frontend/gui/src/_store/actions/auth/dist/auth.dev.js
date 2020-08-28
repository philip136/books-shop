"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refreshToken = exports.authLogin = exports.authSignup = exports.logout = exports.authDoneRefresh = exports.authRefresh = exports.authFail = exports.authSuccess = exports.updateToken = exports.authStart = void 0;

var actionTypes = _interopRequireWildcard(require("../actionTypes"));

var _axios = _interopRequireDefault(require("axios"));

var _constants = require("../../../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var authStart = function authStart() {
  return {
    type: actionTypes.AUTH_START
  };
};

exports.authStart = authStart;

var updateToken = function updateToken(token, refreshToken, username, expirationDate, is_staff) {
  return {
    type: actionTypes.AUTH_UPDATE_TOKEN,
    token: token,
    refreshToken: refreshToken,
    username: username,
    expirationDate: expirationDate,
    is_staff: is_staff
  };
};

exports.updateToken = updateToken;

var authSuccess = function authSuccess(token, refreshToken, username, expirationDate, is_staff) {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    refreshToken: refreshToken,
    username: username,
    expirationDate: expirationDate,
    is_staff: is_staff
  };
};

exports.authSuccess = authSuccess;

var authFail = function authFail(error) {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

exports.authFail = authFail;

var authRefresh = function authRefresh(promise) {
  return {
    type: actionTypes.AUTH_REFRESHING_TOKEN,
    promise: promise
  };
};

exports.authRefresh = authRefresh;

var authDoneRefresh = function authDoneRefresh() {
  return {
    type: actionTypes.AUTH_DONE_REFRESHING_TOKEN
  };
};

exports.authDoneRefresh = authDoneRefresh;

var logout = function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('is_staff');
  localStorage.removeItem('username');
  localStorage.removeItem('expirationDate');
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

exports.logout = logout;

var authSignup = function authSignup(username, email, password1, password2, first_name, last_name) {
  return function (dispatch) {
    dispatch(authStart());

    _axios["default"].post(_constants.registrationUrl, {
      username: username,
      email: email,
      password1: password1,
      password2: password2,
      first_name: first_name,
      last_name: last_name
    }).then(function (res) {
      var token = res.data.access;
      var refreshToken = res.data.refresh;
      var expirationDate = res.data.expirationDate;
      var is_staff = res.data.is_staff;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('username', username);
      localStorage.setItem('expirationDate', expirationDate);
      dispatch(authSuccess(token, refreshToken, username, expirationDate, is_staff));
    })["catch"](function (err) {
      dispatch(authFail(err));
    });
  };
};

exports.authSignup = authSignup;

var authLogin = function authLogin(username, password) {
  return function (dispatch) {
    dispatch(authStart());

    _axios["default"].post(_constants.loginUrl, {
      username: username,
      password: password
    }).then(function (res) {
      var token = res.data.access;
      var refreshToken = res.data.refresh;
      var expirationDate = res.data.expirationDate;
      var is_staff = res.data.is_staff;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('is_staff', is_staff);
      localStorage.setItem('username', username);
      localStorage.setItem('expirationDate', expirationDate);
      dispatch(authSuccess(token, refreshToken, username, expirationDate, is_staff));
    })["catch"](function (err) {
      dispatch(authFail(err));
    });
  };
};

exports.authLogin = authLogin;

var refreshToken = function refreshToken(dispatch, refresh) {
  var refreshTokenPromise = _axios["default"].post(_constants.refreshTokenUrl, {
    refresh: refresh
  }).then(function (res) {
    var newToken = res.data.access;
    var newRefreshToken = res.data.refresh;
    var expirationDate = res.data.expirationDate;
    var username = localStorage.getItem("username");
    var is_staff = localStorage.getItem("is_staff");
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", username);
    localStorage.setItem("is_staff", is_staff);
    localStorage.setItem("refreshToken", newRefreshToken);
    localStorage.setItem("expirationDate", expirationDate);
    dispatch({
      type: actionTypes.AUTH_DONE_REFRESHING_TOKEN
    });
    dispatch(updateToken(newToken, newRefreshToken, username, expirationDate, is_staff));
    return Promise.resolve(newToken);
  })["catch"](function (err) {
    dispatch({
      type: actionTypes.AUTH_DONE_REFRESHING_TOKEN
    });
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

exports.refreshToken = refreshToken;