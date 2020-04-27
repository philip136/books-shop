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

    connect(username) {
        this.socketRef = new WebSocket(socket_url(username));
        this.socketRef.onopen = () => {
            console.log("WebSocket open");
        };

        this.socketRef.onmessage = (e) => {
            this.fetchCoordinates(e.data)
        };

        this.socketRef.onerror = (error) => {
            console.error(error);
        };

        this.socketRef.onclose = () => {
            console.log("WebSocket closed let's reopen");
            this.connect();
        };
    }

    disconnect(){
        this.socketRef.close();
    }

    fetchCoordinates(username) {
        this.sendCoordinates({
            username: username
        });
    }

    sendCoordinates(data) {
        try{
            this.socketRef.send(JSON.stringify({...data}));
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