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
                <div className="product-headline">
                    {this.state.product.name}
                </div>
                <div className="product-image">
                    <img src={this.state.product.image}></img>
                </div>
                <div className="another-info">
                    Цена:{this.state.product.price } BYN,
                    Количество:{this.state.product.count}
                </div>
            </div>
        );
    }

}

export default ProductDetail;