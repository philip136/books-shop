import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createStore, compose, applyMiddleware, combineReducers} from 'redux';
import authReducer from './store/reducers/auth';
import orderRoomReducer from './store/reducers/orderRoom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import 'leaflet/dist/leaflet.css';


const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const rootReducer = combineReducers({
    auth: authReducer,
    orderRoom: orderRoomReducer
});

const store = createStore(rootReducer, composeEnhances(
    applyMiddleware(thunk)
));

const app = (
    <Provider store={store}>
        <App />
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();