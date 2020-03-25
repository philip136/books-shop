import React from 'react';
import axios from 'axios';
import { Button } from 'antd';
import { Card, Col, Row } from 'antd';


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
              <div className="site-card-wrapper">
                <Row gutter={16}>
                    <Col span={8}>
                        <img src={this.state.product.image} width="300w"></img>
                    </Col>
                    <Col span={8} >
                        <Card title={this.state.product.name} bordered={false}>
                        <p>Цена: {this.state.product.price } BYN </p>
                        <p>Количество: {this.state.product.count} </p>
                        <Button type='primary' style={{marginTop: '30px'}}>
                            Купить
                        </Button>
                    </Card>
                  </Col>
                </Row>
              </div>
        );
    }

}

export default ProductDetail;