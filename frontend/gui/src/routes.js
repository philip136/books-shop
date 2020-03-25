import React from 'react';
import {Route} from 'react-router-dom';
import ProductList from './containers/ProductList';
import ProductDetail from './containers/ProductDetail';
import Login from './containers/Login';
import RegistrationForm from './containers/Signup';


const BaseRouter = () => (
    <div>
        <Route exact path='/' component={ProductList} />
        <Route exact path='/products/:productId/' component={ProductDetail} />
        <Route exact path='/login/' component={Login} />
        <Route exact path='/signup/' component={RegistrationForm} />
    </div>
);

export default BaseRouter;