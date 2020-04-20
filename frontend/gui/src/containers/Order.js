import React from "react";
import {Form, Input, Select} from "antd";
import * as actions from "../store/actions/auth";
import {connect} from "react-redux";
import {withMyHook} from "./Login";


class OrderForm extends React.Component{
    state = {
        loading: false,
        error: null,
    }

    render(){
        const form = this.props.form;
        return (
            <div>
                <Form form={form}>
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
                </Form>
            </div>
        );
    }
}

const order = withMyHook(OrderForm)

const mapDispathToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())
    };
};

export default connect(null, mapDispathToProps)(order);
