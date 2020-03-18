import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import * as actions from '../store/actions/auth';
import {connect} from 'react-redux';
import { NavLink } from 'react-router-dom';


const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

class NormalLoginForm extends React.Component{
  onFinish = (values) => { 
    // check validation
    this.props.onAuth(values.username, values.password);
    this.props.history.push('/');
  }

  
  render(){

    return (
      <Form onFinish={this.onFinish}
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
      >
        <Form.Item
          label="Имя пользователя"
          name="username"
          rules={[
            {
              required: true,
              message: 'Пожалуйста, введите имя пользователя!',
            },
          ]}
        >
          <Input />
        </Form.Item>
  
        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            {
              required: true,
              message: 'Пожалуйста, введите пароль!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
  
        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Запомнить меня</Checkbox>
        </Form.Item>
  
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Войти
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, password) => dispatch(actions.authLogin(username, password)) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NormalLoginForm);
