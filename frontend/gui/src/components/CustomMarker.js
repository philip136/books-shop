import L from 'leaflet';

const iconPerson = new L.icon({
    iconUrl: require('../img/user_location.svg'),
    iconSize: [30, 30],

});

// for driver icon
const iconDriver = new L.icon({
    iconUrl: require('../img/user_location.svg'),
    iconSize: [30, 30],
})

export { iconPerson };
export { iconDriver };