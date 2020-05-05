import React from 'react';
import {Map as LeafletMap, TileLayer, Marker, Popup} from 'react-leaflet';
import '../style.css';
import { iconPerson } from "../components/CustomMarker";
import WebSocketInstance from "../websocket";
import {connect} from 'react-redux';
import * as actions from '../store/actions/orderRoom';
import {Button} from "bootstrap-4-react/lib/components";
import Control from 'react-leaflet-control';


class MapContainer extends React.Component {
    // extends state add locations driver and customer
    // status staff if status_staff -> true, render button(order finished)

    state = {
        location: null,
        zoom: 11,
    }

    initialiseRoom() {
        this.waitForSocketConnection(() => {
            WebSocketInstance.fetchLocation(
                localStorage.getItem('username'),
                this.props.match.params.roomID
            );
        });
        this.props.roomOrder(this.props.match.params.roomID);
        WebSocketInstance.connect(this.props.match.params.roomID);
    }

    initialiseRoomParticipants() {
        let participants = this.props.roomInfo['participants'];
        console.log(participants);
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
        }, 1000)
    }

    initialCurrentLocation = () => {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
        navigator.geolocation.getCurrentPosition(
            position => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                this.setState({location:location});
            },
            error => console.log(error.message),
            options
        );
    };

    sendLocation = () => {
        // When user clicked on button state change current_location
        const locationObject = {
            who_shared: localStorage.getItem('username'),
            location: this.state.location,
            roomID: this.props.match.params.roomID
        };
        WebSocketInstance.newRoomLocation(locationObject);
        this.setState({location: locationObject.location});
        window.location.reload(false);
    }

    componentDidMount() {
        this.initialCurrentLocation();
    }

    componentWillReceiveProps(newProps) {
        if (this.props.match.params.roomID !== newProps.match.params.roomID) {
            WebSocketInstance.disconnect();
            this.waitForSocketConnection(() => {
                WebSocketInstance.fetchLocation(
                    localStorage.getItem('username'),
                    newProps.match.params.roomID
                );
            });
            WebSocketInstance.connect(newProps.match.params.roomID);
        }
    }

    render(){
        console.log(this.props);
        const {error, loading, payment} = this.props;
        const position = this.state.location;
        const current_user = localStorage.getItem('username');

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
                        Местоположение {current_user}
                    </ Popup>
                 </ Marker>
                <Control position='topleft'>
                    <Button onClick={ () => this.sendLocation()}>
                        Обновить
                    </ Button>
                </ Control>
            </ LeafletMap>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        roomInfo: state.orderRoom.roomInfo,
        error: state.orderRoom.error,
        loading: state.orderRoom.loading,
        payment: state.orderRoom.payment
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        roomOrder: (roomId) => dispatch(actions.getRoom(roomId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);