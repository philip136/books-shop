"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iconDriver = exports.iconPerson = void 0;

var _leaflet = _interopRequireDefault(require("leaflet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var iconPerson = new _leaflet["default"].icon({
  iconUrl: require('../_images/user_location.svg'),
  iconSize: [30, 30]
}); // for driver icon

exports.iconPerson = iconPerson;
var iconDriver = new _leaflet["default"].icon({
  iconUrl: require('../_images/user_location.svg'),
  iconSize: [30, 30]
});
exports.iconDriver = iconDriver;