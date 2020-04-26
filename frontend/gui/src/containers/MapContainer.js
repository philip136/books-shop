import React from 'react';
import {Map as LeafletMap, TileLayer, Marker, Popup} from 'react-leaflet';
import '../style.css';
import { iconPerson } from "../components/CustomMarker";


class MapContainer extends React.Component {
    state = {
        yourself_coords: {
            lat: 5,
            lon: 5,
        },
        driver_coords: {
            lat: 57.001,
            lon: 29.5345,
        },
        zoom: 13,
    }

    componentDidMount() {
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.getPosition,
                function (error){
                    console.log("Error code " + error.code + " message " + error.message)
                },
                {maximumAge: 0,
                    timeout: 5000,
                    enableHighAccuracy: true})
        }
    }

    getPosition = (position) => {
        this.setState({
            yourself_coords:{
                lat: position.coords.latitude,
                lon: position.coords.longitude,
            }
        });
    }


    render(){
        const position = this.state.yourself_coords;

        return (
                <LeafletMap
                    center={position}
                    zoom={this.state.zoom}
                    maxZoom={16}
                    easeLinearity={0.35}
                >
                <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;><OpenStreetMap</a> contributors"
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />
                 <Marker position={position} icon={ iconPerson }>
                        <Popup>
                            Для дополнительной информации
                        </ Popup>
                 </ Marker>
            </ LeafletMap>
        );
    }
}

export default MapContainer;