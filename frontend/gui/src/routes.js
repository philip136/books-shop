import React from 'react';
import {Route} from 'react-router-dom';
import ProductList from './containers/ProductList';
import ProductDetail from './containers/ProductDetail';


const BaseRouter = () => (
    <div>
        <Route exact path='/' component={ProductList} />
        <Route exact path='/:productId' component={ProductDetail} />
    </div>
);

export default BaseRouter;