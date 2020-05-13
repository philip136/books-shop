import React from 'react';
import {Route} from 'react-router-dom';
import ProductList from './containers/ProductList';
import ProductDetail from './containers/ProductDetail';
import Login from './containers/Login';
import RegistrationForm from './containers/Signup';
import CartList from './containers/CartList';
import OrderForm from './containers/Order';
import MapContainer from './containers/MapContainer';
import ProductType from './containers/ProductType';


const BaseRouter = () => (
    <div>
        <Route exact path='/' component={ProductList} />
        <Route exact path='/products/:productId/' component={ProductDetail} />
        <Route exact path='/products/type/:productType/' component={ProductType} />
        <Route exact path='/login/' component={Login} />
        <Route exact path='/signup/' component={RegistrationForm} />
        <Route exact path='/my-cart/' component={CartList} />
        <Route exact path='/my-order/' component={OrderForm} />
        <Route exact path='/map/:roomID/' component={MapContainer} />
    </div>
);

export default BaseRouter;