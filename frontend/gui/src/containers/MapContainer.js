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



class MapContainer extends React.Component {
    initialiseRoom() {
        this.waitForSocketConnection(() => {
            WebSocketInstance.fetchLocation(
                localStorage.getItem('username'),
                this.props.match.params.roomID
            );
        });
        WebSocketInstance.connect(this.props.match.params.roomID);
    }

    constructor(props) {
        super(props);
        this.initialiseRoom();
        this.state =  {
            location: null,
            location_another_place: {
                lat: 50.121231,
                lng: 27.15123
            },
            zoom: 11,
            status_user: false,
            client: null,
            current_user: localStorage.getItem('username'),
        }
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
        this.props.roomOrder(this.props.match.params.roomID);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.roomInfo !== this.props.roomInfo){
            this.props.roomInfo['participants'].map((participant, i) => {
                if (participant['user']['username'] === localStorage.getItem('username')
                ){
                    if (participant['status_staff'] === true){
                        this.setState({
                            status_user: true
                        });
                    }else{
                        this.setState({
                            client: participant['user']['username']
                        })
                    }
                }
            })
        }
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

        if (newProps.roomInfo !== null){
            const another_location = this.renderRoomLocations(newProps.roomInfo['locations']);
            if (typeof(another_location[0]) === "undefined"){
                this.setState({
                    location_another_place: another_location[1],
                })
            } else {
                this.setState({
                    location_another_place: another_location[0]
                });
            }

        }
    }

    handlePayment = () => {
        const {client} = this.state
        authAxios
            .delete(orderRoomUrl(this.props.match.params.roomID),{client})
                .then(res => {
                    console.log(res.data);
                    this.props.history.push('/');
                })
                .catch(err => {
                    console.log(err.message);
                });
    }

    renderRoomLocations = (locations) => {
        const {current_user} = this.state;
        if (locations !== null){
            return locations.map((location, i, arr) => {
                if (location['title'].search(current_user) === -1){
                    const location_another_place = {
                        lat: location['latitude'],
                        lng: location['longitude']
                    };
                    return location_another_place;
                }
            });
        }
    }

    render(){
        if (this.props.token === null){
            return <Redirect to="/login/" />;
        }
        const {error, loading, payment} = this.props;
        const position = this.state.location;
        const {current_user} = this.state;

        return (
                <LeafletMap
                    center={position}
                    zoom={this.state.zoom}
                    maxZoom={16}
                    easeLinearity={0.35}
                >
                 <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                />
                 <Marker position={position} icon={ iconPerson }>
                    <Popup>
                        Местоположение {current_user}
                    </ Popup>
                 </ Marker>
                <Marker position={this.state.location_another_place} icon={ iconPerson }>
                    <Popup>
                        Местоположение {current_user}
                    </ Popup>
                 </ Marker>
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
                 {this.state.status_user
                    &&
                    <Control position='topleft'>
                        <Button className='map-button' onClick={() => this.handlePayment()}>
                            Оплачено
                        </Button>
                    </Control>
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