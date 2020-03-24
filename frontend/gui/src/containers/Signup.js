import React from 'react';
import { Form, Input, Button } from 'antd';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as actions from '../store/actions/auth';


class RegistrationForm extends React.Component {

  onFinish = (values) => {
    console.log(this.props);
  }

  render() {

    return (
      <Form onSubmit={this.onFinish}>
        
        <Form.Item label='username' name='username'
            rules ={[ 
                {
                    required: true, 
                    message: 'Please input your username!'
                },
             ]}
             >
                 <Input />
        </Form.Item>
        
        <Form.Item label='email' name='email'
        rules ={[ 
            {
                required: true, 
                message: 'Please input your email!'
            },
         ]}
         >
             <Input />
        </Form.Item>

        <Form.Item label='password' name='password'
            rules = {[
            {
                required: true,
                message: 'Please input your password!',
            }
              
            ]}>
                <Input.Password />
        </Form.Item>

        <Form.Item label='confirm' name='confirm'
            rules = {[
                {
                    equired: true,
                     message: 'Please confirm your password!',
                }
            ]}
            >
                <Input.Password />
        </Form.Item>

        <Form.Item>
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
        onAuth: (username, email, password1, password2) => dispatch(actions.authSignup(username, email, password1, password2)) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);