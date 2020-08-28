import React, {useState} from 'react';
import {Button,
        Col,
        Row,
        Form,
        Spin,
        Input,
} from 'antd';
import { antIcon } from '../LoginPage/Login';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import * as cartActions from '../_store/actions/cart/cart';


const mapState = (state) => {
    return {token: state.auth.token,
            loading: state.cart.loading,
            message: state.cart.message,
            product: state.cart.product
        }
};

const mapDispatch = (dispatch) => ({
    addProduct: async (productId, productName, productCount) => dispatch(
        cartActions.addProductToCart(productId, productName, productCount)
    ),
    getProduct: async (productId) => dispatch(
        cartActions.fetchProduct(productId)
    ),
});

const connector = connect(mapState, mapDispatch);


const CountProductInput = ({value = {}, onChange}) => {
    const [number, setNumber] = useState(0);
    
    const triggerChange = (changedValue) => {
        if (onChange) {
            onChange({
                number,
                ...value,
                ...changedValue,
            });
        }
    };

    const onNumberChange = (e) => {
        const newNumber = parseInt(e.target.value || 0, 10);

        if (Number.isNaN(number)) {
            return;
        }

        if (!('number' in value)) {
            setNumber(newNumber);
        }

        triggerChange({
            number: newNumber
        });
    };

    return (
        <span>
            <Input
                type='text'
                value={value.number || number}
                onChange={onNumberChange}
                style={{ width: 100}}
            /> 
        </span> 
    );
};


class ProductDetail extends React.Component{
    componentDidMount() {
        const productId = this.props.match.params.productId;
        this.handleFetchItem(productId);
    };

    handleFetchItem = (productId) => {
        this.props.getProduct(productId);
    };

    onFinish = (values) => {
        const productId = this.props.match.params.productId;
        const productName = this.props.product.name;
        this.props.addProduct(productId, productName, values.count.number);
    };


    checkCount = (rule, value) => {
        if (value.number > 0) {
            return Promise.resolve();
        } 
        return Promise.reject("Количество товаров должно быть больше 0");
    };

    render(){
         if (this.props.token === null){
            return <Redirect to="/login/" />;
         }

        const {loading, product} = this.props; 

        return (
        <div className="site-card-wrapper">
            {loading && (
                <Spin indicator={antIcon} />
            )}
            {product && (
                        <Row gutter={[48]}>
                        <Col span={10}>
                            <img className='product-img' src={product.image}></img>
                        </Col>
                        <Col span={4}></Col>
                        <Col span={8}>
                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <p className="price">Цена: {product.price} BYN </p>
                            <p className="count">Количество: {product.count} </p>

                            <Form
                                layout='inline'
                                onFinish={this.onFinish}
                                initialValues={{
                                    count: {
                                        number: 0
                                    },
                                }}
                            >
                                <Form.Item
                                    name="count"
                                    label="Количество"
                                    rules={[
                                        {
                                            validator: this.checkCount,
                                        },
                                    ]}
                                >
                                    <CountProductInput />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Купить
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                    </Row>
                    )
                }
            </div>
        );
    }

}

const connectedProductDetail = connector(ProductDetail);
export default connectedProductDetail;
