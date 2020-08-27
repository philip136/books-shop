import React from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { connect } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import * as actions from '../_store/actions/auth';
import {antIcon, layout, tailLayout} from '../LoginPage/Login';



function withMyHook(Component){
    return function WrappedComponent(props) {
      const [form] = Form.useForm();
      return <Component {...props} form={form} />;
    }
  }

class RegistrationForm extends React.Component {

    onFinish = (values) => {
        this.props.onAuth(
                            values.username,
                            values.email,
                            values.password,
                            values.confirm,
                            values.first_name,
                            values.last_name
                          );
    }

    render() {
        if (typeof(this.props.token) !== "undefined"){
            return (<Redirect to='/' />)
        }

        let errorMessage = null;
        if (this.props.error){
            errorMessage = (
                <p>{this.props.error.message}</p>
            );
        }
        const form = this.props.form;

            return (
               <div>
                   {errorMessage}
                   {this.props.loading ?
                   
                    <Spin indicator={antIcon} /> :

                    
                    <Form {...layout} form={form} onFinish={this.onFinish}>
                        
                        <Form.Item label='Имя пользователя' name='username'
                            rules ={[ 
                                {
                                    required: true, 
                                    message: 'Пожалуйста введите ваше имя пользователя!'
                                },
                            ]}
                            >
                                <Input />
                        </Form.Item>
                       <Form.Item label="Ваше имя" name="first_name"
                            rules = {[
                                        {
                                            required: true,
                                            message: 'Пожалуйста введите ваше имя'
                                        },
                            ]}
                        >
                            <Input />
                       </Form.Item>

                       <Form.Item label="Ваша фамилия" name="last_name"
                            rules = {[
                                        {
                                            required: true,
                                            message: 'Пожалуйста введите вашу фамилию'
                                        },
                            ]}
                        >
                            <Input />
                       </Form.Item>
                        
                        <Form.Item label='Адрес электронной почты' name='email'
                        rules ={[ 
                            {
                                type: 'email',
                                message: 'Введен неверный E-mail!',
                            },
                            {
                                required: true,
                                message: 'Пожалуйста введите ваш электронный адрес!',
                            },
                        ]}
                        >
                            <Input />
                        </Form.Item>
            
                        <Form.Item label='Пароль' name='password'
                            rules = {[
                            {
                                required: true,
                                message: 'Пожалуйста введите ваш пароль!',
                            }
                            ]}
                        hasFeedback
                        >
                                <Input.Password />
                        </Form.Item>
            
                        <Form.Item label='Подтверждение пароля' name='confirm'
                            dependencies={['password']}
                            hasFeedback
                            rules = {[
                                {
                                    required: true,
                                    message: 'Пожалуйста подтвердите ваш пароль!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                        
                                    return Promise.reject(
                                        'Два введенных вами пароля не совпадают!'
                                        );
                                    },
                                }),
                            ]}
                            >
                                <Input.Password />
                        </Form.Item>
            
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit" style={{marginRight: '10px'}}>
                                Зарегистрироваться
                            </Button>
                            Или
                            <NavLink 
                                style={{marginRight: '10px'}} 
                                to='/login/'> Войти
                            </NavLink>
                        </Form.Item>
                    </Form>
                  }
              </div> 
            );
    }
}

const wrappedForm = withMyHook(RegistrationForm);

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error,
        token: state.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, email, password1, password2, first_name, last_name) => dispatch(
            actions.authSignup(username, email, password1, password2, first_name, last_name)
            ) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);