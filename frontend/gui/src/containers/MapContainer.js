import React from 'react';
import {Map as LeafletMap, TileLayer, Marker, Popup} from 'react-leaflet';
import { iconPerson } from "../components/CustomMarker";
import WebSocketInstance from "../websocket";
import {connect} from 'react-redux';
import * as actions from '../store/actions/orderRoom';
import {Button} from "bootstrap-4-react/lib/components";
import Control from 'react-leaflet-control';
import {Link} from 'react-router-dom';
import {orderRoomUrl} from '../constants';
import { authAxios } from '../utils';
import { Redirect } from "react-router-dom";
import axios from 'axios';


class MapContainer extends React.Component {
    state = {
       location: {lat: 52.0012, lng: 27.123}
    };

    initialiseRoom() {
        this.waitForSocketConnection(() => {
            WebSocketInstance.fetchLocations(
                this.props.username,
                this.props.match.params.roomID
            );
        });
        WebSocketInstance.connect(this.props.match.params.roomID);
    }

    constructor(props) {
        super(props);
        this.initialiseRoom();
    }

    waitForSocketConnection(callback) {
        const component = this;
        setTimeout(function () {
            if (WebSocketInstance.state() === 1) {
                console.log("Connection is made");
                callback();
                return;
            } else {
                console.log("Wait for connection ...");
                component.waitForSocketConnection(callback);
            }
        }, 100)
    }

    sendLocation = async() => {
        await navigator.geolocation.getCurrentPosition(
            position => {
                const locationObject = {
                    who_shared: this.props.username,
                    roomID: this.props.match.params.roomID,
                    location: {lat: position.coords.latitude, lng: position.coords.longitude}
                };
                WebSocketInstance.newRoomLocation(locationObject);
            }
        );
    };

    componentWillReceiveProps(newProps) {
        if (this.props.match.params.roomID !== newProps.match.params.roomID) {
            WebSocketInstance.disconnect();
            this.waitForSocketConnection(() => {
                WebSocketInstance.fetchLocations(
                    this.props.username,
                    newProps.match.params.roomID
                );
            });
            WebSocketInstance.connect(newProps.match.params.roomID);
        }
    }

    renderLocation = locations => {
        const currentUser = this.props.username;
        console.log(locations);
        return locations.map((location, i) => (
            <Marker key={i} position={location.point.reverse()} icon={ iconPerson }>
                <Popup>
                    {location.profile}
                </ Popup>
            </ Marker>
        ));
    };

    render(){
        return (
                <LeafletMap
                    center={this.state.location}
                    zoom={11}
                    maxZoom={16}
                    easeLinearity={0.35}
                >
                 <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                />
                {this.props.locations && this.renderLocation(this.props.locations) }

                <Control position='topleft'>
                    <Button className='map-button' onClick={ () => this.sendLocation()}>
                        Обновить
                    </ Button>
                </ Control>
                 <Control position='topleft'>
                <Button className='map-button'>
                    <Link to="/">Вернуться</Link>
                </Button>
                 </Control>
            </ LeafletMap>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.auth.username,
        locations: state.location.locations
    };
};


export default connect(mapStateToProps)(MapContainer);