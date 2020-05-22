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


function getLocation(){
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition((position) => {
            resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        }, () => {
            resolve(axios
                    .get('https://ipapi.co/json')
                    .then(res => res.json())
                    .then(location => {
                        return {
                            lat: location.latitude,
                            lng: location.longitude,
                        };
                 }));
            });
        });
};



class MapContainer extends React.Component {
    initialiseRoom() {
        this.waitForSocketConnection(() => {
            try{
                WebSocketInstance.fetchLocations(
                localStorage.getItem('username'),
                this.props.match.params.roomID
                )
            }
            catch {
                this.props.history.push('/');
            }
        });
        WebSocketInstance.connect(this.props.match.params.roomID);
    }

    constructor(props) {
        super(props);
        this.initialiseRoom();
        this.state =  {
            location: {
                lat: null,
                lng: null,
            },
            location_another_place: {
                lat: null,
                lng: null,
            },
            zoom: 11,
            client: null,
            courier: null,
            staff: false,
        };
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

    sendLocation = () => {
        if (localStorage.getItem('username') === this.state.client){
            const locationObject = {
                who_shared: localStorage.getItem('username'),
                location: this.state.location,
                roomID: this.props.match.params.roomID
            };
            WebSocketInstance.newRoomLocation(locationObject);
            this.setState({location: locationObject.location});
        }else {
            const locationObject = {
                who_shared: localStorage.getItem('username'),
                location: this.state.location_another_place,
                roomID: this.props.match.params.roomID
            };
            WebSocketInstance.newRoomLocation(locationObject);
            this.setState({location_another_place: locationObject.location});
        }
    }

    parsedPoint = (point) => {
        let lat = point.split(' ')[1].slice(1,);
        let lng = point.split(' ')[2].slice(0, point.split(' ')[2].length-1);
        return [lat*1, lng*1];
    }

    componentDidMount() {
        this.props.roomOrder(this.props.match.params.roomID)
        .then(() => {
            let courier_username = this.props.roomInfo.participants[1].user.username;
            let client_username = this.props.roomInfo.participants[0].user.username;
            let location_client = this.props.roomInfo.locations[0];
            let location_courier = this.props.roomInfo.locations[1];
            this.setState({
                client: client_username,
                courier: courier_username,
                location: {
                    lat: this.parsedPoint(location_client.point)[1],
                    lng: this.parsedPoint(location_client.point)[0],
                },
                location_another_place: {
                    lat: this.parsedPoint(location_courier.point)[1],
                    lng: this.parsedPoint(location_courier.point)[0],
                },
            });
        })
        .then(() => {
             getLocation()
            .then(location_points => {
                if (localStorage.getItem('username') === this.state.client) {
                    const locationObject = {
                        who_shared: this.state.client,
                        location: location_points,
                        roomID: this.props.match.params.roomID
                    };
                    console.log('for client');
                    WebSocketInstance.newRoomLocation(locationObject);
                    this.setState({
                        location: location_points,
                        staff: false,
                    });
                }else if (localStorage.getItem('username') === this.state.courier){
                    console.log('for courier');
                    const locationObject = {
                        who_shared: this.state.courier,
                        location: location_points,
                        roomID: this.props.match.params.roomID
                    };
                    WebSocketInstance.newRoomLocation(locationObject);
                    this.setState({
                        location_another_place: location_points,
                        staff: true,
                    });
                }
           });
        });
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

    handlePayment = () => {
        let client = this.state.client;
        if (localStorage.getItem('username') === this.state.courier){
            authAxios
            .delete(orderRoomUrl(this.props.match.params.roomID),{client})
                .then(res => {
                    localStorage.removeItem('roomId');
                    this.props.history.push('/');
                })
                .catch(err => {
                    console.log(err.message);
            });
        }
    }


    render(){
        const {error, loading, payment} = this.props;
        const {client, courier, status_user} = this.state;
        console.log(this.state);
        return (
                <LeafletMap
                    center={this.state.location}
                    zoom={this.state.zoom}
                    maxZoom={16}
                    easeLinearity={0.35}
                >
                 <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                />
                 <Marker position={this.state.location} icon={ iconPerson }>
                    <Popup>
                        {client}
                    </ Popup>
                 </ Marker>

                <Marker position={this.state.location_another_place} icon={ iconPerson }>
                    <Popup>
                       {courier}
                    </ Popup>
                </ Marker>

                <Control position='topleft'>
                    <Button className='map-button' onClick={ () => this.sendLocation(status_user)}>
                        Обновить
                    </ Button>
                </ Control>
                 <Control position='topleft'>
                <Button className='map-button'>
                    <Link to="/">Вернуться</Link>
                </Button>
                 </Control>
                 {this.state.staff
                    ?
                    <Control position='topleft'>
                        <Button className='map-button' onClick={() => this.handlePayment()}>
                            Оплачено
                        </Button>
                    </Control>
                    :
                    null
                 }
            </ LeafletMap>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        roomInfo: state.orderRoom.roomInfo,
        error: state.orderRoom.error,
        loading: state.orderRoom.loading,
        payment: state.orderRoom.payment,
        token: state.auth.token,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        roomOrder: (roomId) => dispatch(actions.getRoom(roomId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);