import React from 'react';
import axios from 'axios';
import { Card,
        Button,
        Col,
        Row,
        Form,
        Input,
        message,
        Spin
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
            })
            .catch(err => {
                this.setState({error: err})
            });
    };

    handleChange = (e) => {
        let val = e.target.value * 1;
        const {formData} = this.state;
        const updatedFormData = {
            ...formData,
            ['count']: val
        };
        this.setState({formData: updatedFormData});
    };
    

    render(){
        const {loading, error, data} = this.state
        const item = data;

        return (
        <div className="site-card-wrapper">
            {error}
            {
                loading ? 
                <Spin indicator={antIcon} />

                :
                <Row gutter={16}>
                    <Col span={8}>
                        <img src={this.state.data.image} width="300w"></img>
                    </Col>
                    <Col span={8} >
                        <Card title={this.state.data.name} bordered={false}>
                        <p>Цена: {this.state.data.price } BYN </p>
                        <p>Количество: {this.state.data.count} </p>
                        </Card>
                        <Form onFinish={() => this.handleAddToCart(item)}>
                            <Form.Item
                                label="Количество"
                                rules={[
                                    {
                                        required: true,
                                        message: "Введите количество продуктов которые вы хотите купить"
                                    },
                                ]}>
                                <Input onChange={this.handleChange} />
                            </Form.Item>
                            <Button type='primary' style={{marginTop: '30px'}} htmlType="submit">
                                Купить
                            </Button>
                        </Form>
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
