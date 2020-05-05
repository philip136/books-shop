import React from "react";
import {Button, Form, Input, Select} from "antd";
import {withMyHook} from "./Login";
import {orderUrl} from "../constants";
import {authAxios} from '../utils';


class OrderForm extends React.Component{
    state = {
        loading: false,
        error: null,
    }

    handleCheckout = (data) => {
        // add user in data
        authAxios
            .post(orderUrl, {...data})
            .then(res => {
                window.location.reload();
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
                <Form form={form} onFinish={this.handleCheckout}>
                    <Form.Item
                        label="Ваше имя"
                        name="first_name"
                        rules = {[
                            {
                                required: true,
                                message: "Пожалуйста введите ваше имя"
                            },
                        ]}
                    >
                        <Input placeholder="Введите ваше имя" />
                    </Form.Item>
                    <Form.Item
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
                    <Form.Item
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
                    <Form.Item
                        label="Тип покупки"
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
                    <Button type="primary" htmlType="submit" style={{marginRight: '10px'}}>
                  Продолжить
                </Button>
                </Form>
            </div>
        );
    }
}

const order = withMyHook(OrderForm)

export default order;
