import React,{Component} from 'react';
import Product from '../components/Product';
import axios from 'axios';
import { List } from 'antd';


class ProductList extends Component{
    state = {
        products: []
    };
    
    componentDidMount(){
        axios.get('http://127.0.0.1:8000/api/products/')
            .then(res => {
                this.setState({
                    products: res.data
                });
            });
    }

    render(){
        return(
            <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={this.state.products}
                renderItem={item => (
                <List.Item>
                    <Product data={item}></Product>
                </List.Item>
                )}
            />
        );   
                                                       
    }
}

export default ProductList;