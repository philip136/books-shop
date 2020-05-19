import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import {CarOutlined, UserOutlined,ShoppingCartOutlined,} from '@ant-design/icons';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import {roomUrl} from '../constants';
import { authAxios } from '../utils';


const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;


const roomIdIsExist = (props) => {
    const username = localStorage.getItem('username');
    authAxios
        .post(roomUrl, {username})
            .then(res => {
                const roomId = res.data.message;
                if (localStorage.getItem('roomId') === null){
                    localStorage.setItem('roomId', roomId);
                }
                return props.history.push(`/map/${roomId}/`);
            })
            .catch(err => {
                console.log(err.message);
                return props.history.push('/');
            });
}


const CustomLayout = (props) => {
    return (
        <Layout>
          <Header className="header">
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ lineHeight: '64px' }}
            >
            
              {
                props.isAuthenticated ?
                
                <Menu.Item key="4" onClick={props.logout}>
                  Выйти
                </Menu.Item>
                
                :
                <Menu.Item key="4">
                  <Link to="/login/">Вход</Link>
                </Menu.Item>
              }

              <Menu.Item key="1">
                <Link to="/">Главная</Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Layout>
            <Sider width={200} className="site-layout-background">
              <Menu
                mode="inline"
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0 }}
              >
                <SubMenu
                  key="sub1"
                  title={
                    <span>
                      <UserOutlined />
                      Товары
                    </span>
                  }
                >
                  
                  <Menu.Item key="1"
                    onClick={() => props.history.push('/products/type/books/')}>
                    Книги
                  </Menu.Item>
                  <Menu.Item key="2"
                    onClick={() => props.history.push('/products/type/notepads/')}>
                    Блокноты
                  </Menu.Item>
                  <Menu.Item key="3"
                  onClick={() => props.history.push('/products/type/calendars/')}>
                  Календари
                  </Menu.Item>
                </SubMenu>
                <SubMenu
                  key="sub2"
                  title={
                    <span>
                      <ShoppingCartOutlined />
                        Ваша корзина
                    </span>
                  }
                >
                  <Menu.Item key="5" onClick={() => props.history.push('/my-cart/')}>Корзина</Menu.Item>
                </SubMenu>
                <SubMenu
                  key="sub3"
                  title={
                    <span>
                      <CarOutlined />
                      Доставка
                    </span>
                  }
                >
                  <Menu.Item key="9" onClick={() => roomIdIsExist(props)}>
                    Курьеры
                  </Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
              <Content
                className="site-layout-background"
                style={{
                  padding: 24,
                  margin: 0,
                  minHeight: 280,
                }}
              >
                {props.children}
              </Content>
            </Layout>
          </Layout>
        </Layout>
      );
}



const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.logout())
  }
}

export default withRouter(connect(null, mapDispatchToProps)(CustomLayout));
