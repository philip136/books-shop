import React from "react";
import {Button, Form, Input, Select} from "antd";
import {withMyHook} from "./Login";
import {orderUrl} from "../constants";
import {authAxios} from '../utils';
import { Alert } from 'antd';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";



const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 2,
    span: 16,
  },
};



class OrderForm extends React.Component{
    state = {
        loading: false,
        error: null,
        message: null,
        showMessage: false,
    }

    handleCheckout = (data) => {
        let extendData = {...data};
        extendData.user = localStorage.getItem('username');

        authAxios
            .post(orderUrl, extendData)

            .then(res => {
                if (typeof(res.data.message) === "string"){
                    this.setState({
                        showMessage: true,
                        message: res.data.message,
                    });
                }
                else {
                    localStorage.setItem('roomId', res.data.message['id']);
                    const roomId = localStorage.getItem('roomId');
                    return this.props.history.push(`/map/${roomId}/`);
                }
            })
            .catch(err => {
                this.setState({
                    error: err,
                    loading: false
                })
            })

    };

    render(){
        const form = this.props.form;

        return (
            <div>
                {this.state.showMessage
                &&
               <Alert message={this.state.message} type="info" />
                }
                <Form {...layout} form={form} onFinish={this.handleCheckout}>
                    <Form.Item {...tailLayout}
                        label="Ваше имя"
                        name="first_name"
                        rules = {[
                            {
                                required: true,
                                message: "Пожалуйста введите ваше имя"
                            },
                        ]}
                    >
                        <Input placeholder="Введите ваше имя"  />
                    </Form.Item>
                    <Form.Item {...tailLayout}
                        label="Ваша фамилия"
                        name="last_name"
                        rules = {[
                            {
                                required: true,
                                message: "Пожалуйста введите вашу фамилию"
                            },
                        ]}
                    >
                        <Input placeholder="Введите вашу фамилию" />
                    </Form.Item>
                    <Form.Item {...tailLayout}
                        label="Мобильный телефон"
                        name="phone"
                        rules = {[
                            {
                                required: true,
                                message: "Пожалуйста введите номер вашего " +
                                    "мобильного телефона"
                            },
                        ]}
                    >
                        <Input placeholder="Введите ваш номер мобильного телефона" />
                    </Form.Item>
                    <Form.Item {...tailLayout}
                        label="Тип покупки"
                        name="purchase_type"
                        rules = {[
                            {
                               required: true,
                               message: "Пожалуйста выберите тип покупки"
                            },
                        ]}
                        >
                        <Select>
                            <Select.Option value="Самовывоз">Самовывоз</Select.Option>
                            <Select.Option value="Доставка курьером">Доставка курьером</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                      <Button  type="primary" htmlType="submit">
                         Продолжить
                      </Button>
                    </Form.Item>
                </Form>
            </div>

        );
    }
}

const order = withMyHook(OrderForm)

const mapStateToProps = state => {
    return {
        token: state.auth.token,
    }
}

export default connect(mapStateToProps)(order);



