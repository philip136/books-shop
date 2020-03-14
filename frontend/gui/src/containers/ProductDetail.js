import React from 'react';
import axios from 'axios';
import Product from '../components/Product';


class ProductDetail extends React.Component{
    state = {
        product: {}
    }

    componentDidMount() {
        const productId = this.props.match.params.productId;
        axios.get(`http://127.0.0.1:8000/api/products/${productId}/`)
            .then(res => {
                this.setState({
                    product: res.data
                });
            })

    }
    render(){
        return (
            <div className="productDetail">
                <Product data={this.state.product} />
            </div>
        );
    }

}

export default ProductDetail;