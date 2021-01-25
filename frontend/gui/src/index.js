import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createStore, compose, applyMiddleware, combineReducers} from 'redux';
import authReducer from './_store/reducers/auth/auth';
import locationReducer from './_store/reducers/orderRoom/orderRoom';
import cartReducer from './_store/reducers/cart/cart';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import 'leaflet/dist/leaflet.css';
import {jwt} from './_store/middleware/jwt_middleware';
import 'bootstrap/dist/css/bootstrap.min.css';


const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    auth: authReducer,
    location: locationReducer,
    cart: cartReducer,
});


const store = createStore(rootReducer, composeEnhances(
    applyMiddleware
    (
        jwt,
        thunkMiddleware
    )
));


const app = (
    <Provider store={store}>
        <App />
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();