import {socket_url} from "./constants";

class WebsocketService {
    static instance = null;
    callbacks = {};

    static getInstance() {
        if (!WebsocketService.instance) {
            WebsocketService.instance = new WebsocketService();
        }
        return WebsocketService.instance;
    }

    constructor() {
        this.socketRef = null;
    }

    connect(roomID) {
        this.socketRef = new WebSocket(socket_url(roomID));
        this.socketRef.onopen = () => {
            console.log("WebSocket open");
        };
        this.socketRef.onmessage = (e) => {
            this.socketNewLocation(e.data);
        };

        this.socketRef.onerror = (error) => {
            console.log(error.message);
        };

        this.socketRef.onclose = () => {
            console.log("WebSocket closed let's reopen");
            this.connect();
        };
    }

    disconnect() {
        this.socketRef.close();
    }

    socketNewLocation(data) {
        const parsedData = JSON.parse(data);
        const command = parsedData.command;
        if (Object.keys(this.callbacks).length === 0) {
            return;
        }
        if (command === 'location') {
            this.callbacks[command](parsedData.location);
        }
        if (command === 'new_location') {
            this.callbacks[command](parsedData.location)
        }
    }

    fetchLocation(username, roomID) {
        this.sendLocation({
            command: 'fetch_location',
            username: username,
            roomID: roomID
        });
    }

    newRoomLocation(location) {
        this.sendLocation({
            command: 'new_location',
            who_shared: location.who_shared,
            location: location.location,
            roomID: location.roomID
        })
    }

    addCallbacks(locationCallback, newLocationCallback) {
        this.callbacks['location'] = locationCallback;
        this.callbacks['new_location'] = newLocationCallback;
    }

    sendLocation(data) {
        try {
            this.socketRef.send(JSON.stringify({...data}))
        } catch (error) {
            console.log(error.message);
        }
    }

    state() {
        return this.socketRef.readyState;
    }
}

const WebSocketInstance = WebsocketService.getInstance();
export default WebSocketInstance;