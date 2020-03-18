import React from 'react';
import {Route} from 'react-router-dom';
import ProductList from './containers/ProductList';
import ProductDetail from './containers/ProductDetail';
import Login from './containers/Login';
import {NavLink} from 'react-router-dom';

const BaseRouter = () => (
    <div>
        <Route exact path='/' component={ProductList} />
        <Route exact path='/:productId' component={ProductDetail} />
        <Route exact path='/login/' component={Login} />
    </div>
);

export default BaseRouter;