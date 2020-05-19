import React, {Component} from 'react';
import axios from 'axios';
import {productTypeUrl} from "../constants";
import {List, Card} from "antd";
import Product from "../components/Product";


class ProductType extends Component{
    state = {
        products: [],
        error: null,
    };

    componentDidMount() {
        const slug = this.props.match.params.productType;
        axios.get(productTypeUrl(slug))
            .then(res => {
                this.setState({
                    products: res.data
                });
            })
            .catch(err => {
                this.setState({
                    error: err
                });
            })
    }

     componentWillReceiveProps(newProps){
        if (this.props.match.params.productType !== newProps.match.params.productType){
            window.location.reload();
        }
     }

    render() {
        return (
            <List
                grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 3,
                lg: 3,
                xl: 4,
                xxl: 4}}
                dataSource={this.state.products}
                renderItem={item => (
                <List.Item>
                     <Card title={item.name}>
                            <Product data={item} />
                     </Card>
                </List.Item>
                )}
            />
        );
    }
}

export default ProductType;