import React from 'react';
import {Map as LeafletMap, TileLayer, Marker, Popup} from 'react-leaflet';
import '../style.css';
import { iconPerson } from "../components/CustomMarker";


class MapContainer extends React.Component {
    render(){
        return (
            <LeafletMap
                center={[50, 10]}
                zoom={10}
                maxZoom={14}
                zoomControl={true}
                easeLinearity={0.35}
            >
                <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;><OpenStreetMap</a> contributors"
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />
                 <Marker position={[50, 10]} icon={ iconPerson }>
                        <Popup>
                            Для дополнительной информации
                        </Popup>
                 </Marker>
            </LeafletMap>
        );
    }
}

export default MapContainer;