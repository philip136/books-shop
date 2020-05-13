import React from 'react';
import axios from 'axios';
import { Card,
        Button,
        Col,
        Row,
        Form,
        Input,
        message,
        Spin,
        InputNumber,
} from 'antd';
import { antIcon } from './Login';
import { authAxios } from '../utils';
import { productDetailUrl, addToCartUrl } from '../constants';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchCart } from '../store/actions/cart';


class ProductDetail extends React.Component{
    state = {
        loading: false,
        error: null,
        data: [],
        formData: {}
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
        const {formData} = this.state;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        const count = formData['count'];
        const product_name = product['name']
        authAxios
            .post(addToCartUrl(id), { product_name, count })
            .then(res => {
                this.props.refreshCart();
                this.setState({loading: false});
                if (res.status == 200){
                    message.warning(res.data['message']);
                }
                else {message.success(res.data['message']);}
            })
            .catch(err => {
                this.setState({error: err});
                message.error(err);
            });
    };

    handleChange = (value) => {
        const {formData} = this.state;
        const updatedFormData = {
            ...formData,
            ['count']: value
        };
        this.setState({formData: updatedFormData});
    };
    

    render(){
        const {loading, error, data} = this.state
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

const mapDispathToProps = dispatch => {
    return {
        refreshCart: () => dispatch(fetchCart())
    };
};

export default withRouter(
    connect(null, mapDispathToProps)(ProductDetail)
);
