import L from 'leaflet';

const iconPerson = new L.icon({
    iconUrl: require('../img/marker-cli.png'),
    iconRetinaUrl: require('../img/marker-cli.png'),
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(20, 25),
    className: 'leaflet-div-icon'
});

// for driver icon
const iconDriver = new L.icon({
    iconUrl: require('../img/marker-cli.png'),
    iconRetinaUrl: require('../img/marker-cli.png'),
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(20, 25),
    className: 'leaflet-div-icon'
})

export { iconPerson };
export { iconDriver };