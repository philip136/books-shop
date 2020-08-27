import React from 'react';
import axios from 'axios';
import {Button,
        Col,
        Row,
        Form,
        message,
        Spin,
        InputNumber,
} from 'antd';
import { antIcon } from '../LoginPage/Login';
import { authAxios } from '../utils';
import { productDetailUrl, addToCartUrl } from '../constants';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";


class ProductDetail extends React.Component{
    state = {
        loading: false,
        error: null,
        data: [],
        count: {}
    };

    componentDidMount() {
        this.handleFetchItem();
    }

    handleFetchItem = () => {
        const {
            match: {params}
        } = this.props;
        this.setState({loading: true});
        axios
            .get(productDetailUrl(params.productId))
                .then(res => {
                    this.setState({data: res.data, loading: false});
                })
                .catch(err => {
                    this.setState({error: err, loading: false})
                });
    };

    handleAddToCart = (product) => {
        const id = this.props.match.params.productId;
        this.setState({ loading: true });
        
        authAxios()
            .post(addToCartUrl(id), { 
                product_name: product.name,
                count: this.state.count
            })
            .then(res => {
                this.handleFetchItem()
                message.success(res.data.message)    
            })
            .catch(err => {
                this.setState({error: err});
                message.error(err);
            });
    };

    handleChange = (value) => {
        this.setState({
            count: value
        })
    };

    componentDidUpdate(prevProps, prevState){
        if (prevState.data !== this.state.data){
            this.setState({
                data: this.state.data
            });
        }
    }


    render(){
         if (this.props.token === null){
            return <Redirect to="/login/" />;
         }

        const {loading, data} = this.state
        const item = data;

        return (
        <div className="site-card-wrapper">
            {
                loading ? 
                <Spin indicator={antIcon} />

                :
                <Row gutter={[48]}>
                    <Col span={10}>
                        <img className='product-img' src={this.state.data.image}></img>
                    </Col>
                    <Col span={4}></Col>
                    <Col span={8}>
                     <div className="product-info">
                        <h3>{this.state.data.name}</h3>
                        <p className="price">Цена: {this.state.data.price } BYN </p>
                        <p className="count">Количество: {this.state.data.count} </p>

                        <Form onFinish={() => this.handleAddToCart(item)}>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: "Введите количество продуктов которые вы хотите купить"
                                    },
                                ]}>
                                <InputNumber min={1} max={this.state.data.count} onChange={this.handleChange} />
                            </Form.Item>
                            <Button type='primary' style={{marginTop: '30px'}} htmlType="submit">
                                Купить
                            </Button>
                        </Form>
                      </div>
                  </Col>
                </Row>
                }
            </div>
        );
    }

}


const mapStateToProps = (state) => {
    return {
        token: state.auth.token
    }
}


export default connect(mapStateToProps)(ProductDetail);
