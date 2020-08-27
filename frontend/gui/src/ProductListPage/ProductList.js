import React,{Component} from 'react';
import Product from '../_components/Product';
import axios from 'axios';
import { List, Card} from 'antd';
import {productListUrl} from "../constants";


class ProductList extends Component{
    state = {
        products: []
    };
    
    componentDidMount(){
        axios.get(productListUrl)
            .then(res => {
                this.setState({
                    products: res.data
                });
            });
    }

    render(){
        return(

            <List
                grid={{
                      gutter: 16,
                      xs: 1,
                      sm: 2,
                      md: 4,
                      lg: 4,
                      xl: 4,
                      xxl: 3,
                }}
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

export default ProductList;



