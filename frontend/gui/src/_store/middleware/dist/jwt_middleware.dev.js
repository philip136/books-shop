"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jwt = void 0;

var _auth = require("../actions/auth/auth");

var jwt = function jwt(_ref) {
  var dispatch = _ref.dispatch,
      getState = _ref.getState;
  return function (next) {
    return function (action) {
      if (typeof action === 'function') {
        if (getState().auth && getState().auth.token) {
          var newToken = getState().auth.refreshToken;
          var tokenExpiration = getState().auth.expirationDate;
          var timeNow = new Date().getSeconds();

          if (tokenExpiration - timeNow < 5) {
            if (!getState().auth.refreshingPromise) {
              return (0, _auth.refreshToken)(dispatch, newToken).then(function () {
                return next(action);
              });
            } else {
              return getState().auth.refreshingPromise.then(function () {
                return next(action);
              });
            }
          }
        }
      }

      return next(action);
    };
  };
};

exports.jwt = jwt;