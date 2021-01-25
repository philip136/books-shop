import React from 'react';
import {Map as LeafletMap, TileLayer, Marker, Popup} from 'react-leaflet';
import { iconPerson } from "../_components/CustomMarker";
import WebSocketInstance from "../websocket";
import {connect} from 'react-redux';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import Control from 'react-leaflet-control';
import {Link, Redirect} from 'react-router-dom';
import * as actions from '../_store/actions/orderRoom/orderRoom';



class MapContainer extends React.Component {
    state = {
       location: {lat: 53.893009, lng: 27.567444}
    };

    initializeRoom() {
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
        this.initializeRoom();
        this.closeOrder = this.closeOrder.bind(this);
        this.onGotoMainPageClick = this.onGotoMainPageClick.bind(this);
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

    getIsStuff() { 
        return localStorage.getItem('is_staff') === 'true';
    } 

    closeOrder() {
        const roomId = this.props.match.params.roomID;
        this.props.closeOrder(roomId);
    }

    onGotoMainPageClick() {
        this.props.history.push('/');
    }

    render(){
        return (
            <>
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
                    <Button outline className='map-button' onClick={ () => this.sendLocation()}>
                        Обновить
                    </Button>
                </Control>
                <Control position='topleft'>
                    <Button outline color='primary' className='map-button'>
                        <Link to="/">Вернуться</Link>
                    </Button>
                </Control>
                {this.getIsStuff() && (
                    <Control position='topleft'>
                        <Button outline className='map-button' onClick={this.closeOrder} disabled={this.props.isClosed}>{this.props.isClosed? 'Закрыто' : 'Закрыть заказ'}</Button>
                    </Control>
                )}
            </LeafletMap>
            {!this.getIsStuff() && (
                <Modal isOpen={this.props.isClosed}>
                    <ModalHeader>Статус заказа</ModalHeader>
                    <ModalBody>Ваш заказ был выполнен и закрыт!</ModalBody>
                    <ModalFooter><Button color='primary' onClick={this.onGotoMainPageClick}>Вернуться на главную</Button></ModalFooter>
                </Modal>
            )}
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.auth.username,
        locations: state.location.locations,
        token: state.auth.token,
        isClosed: state.location.isClosed
    };
};

const mapDispatchToProps = dispatch => {
    return {
        closeOrder: id => dispatch(actions.closeOrder(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);