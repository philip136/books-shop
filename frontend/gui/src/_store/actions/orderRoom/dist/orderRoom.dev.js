"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserRoom = exports.getUserRoomSuccess = exports.setLocations = exports.addLocation = void 0;

var actionTypes = _interopRequireWildcard(require("../actionTypes"));

var _axios = _interopRequireDefault(require("axios"));

var _utils = require("../../../utils");

var _constants = require("../../../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var addLocation = function addLocation(location) {
  return {
    type: actionTypes.ADD_LOCATION,
    location: location
  };
};

exports.addLocation = addLocation;

var setLocations = function setLocations(locations) {
  return {
    type: actionTypes.SET_LOCATIONS,
    locations: locations
  };
};

exports.setLocations = setLocations;

var getUserRoomSuccess = function getUserRoomSuccess(room) {
  return {
    type: actionTypes.GET_ROOM_SUCCESS,
    room: room
  };
};

exports.getUserRoomSuccess = getUserRoomSuccess;

var getUserRoom = function getUserRoom(id) {
  return function (dispatch) {
    (0, _utils.authAxios)().get((0, _constants.orderRoomUrl)(id)).then(function (res) {
      return dispatch(getUserRoomSuccess(res.data));
    });
  };
};

exports.getUserRoom = getUserRoom;