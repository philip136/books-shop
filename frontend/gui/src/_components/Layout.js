import React from 'react';
import { Layout, Menu, Breadcrumb, message, notification } from 'antd';
import {CarOutlined, UserOutlined,ShoppingCartOutlined,} from '@ant-design/icons';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../_store/actions/auth/auth';
import * as locationActions from '../_store/actions/orderRoom/orderRoom';
import { roomUrl } from '../constants';
import { authAxios } from '../utils';
import { SmileOutlined } from '@ant-design/icons';


const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const openNotification = (description) => {
    notification.open({
        message: 'Оповещение',
        description: description,
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });
}


const roomIdIsExist = (props) => {
    authAxios()
        .post(roomUrl, {username: props.username})
        .then(res => {
            if (typeof(res.data.message) === "string"){
                openNotification(res.data.message);
            } else{
                props.history.push(`/map/${res.data.message}/`);
                props.getUserRoom(res.data.message);
            }
        })
        .catch(err => {
            props.history.push('/login/');
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
                    onClick={() => props.history.push('/products/type/book/')}>
                    Книги
                  </Menu.Item>
                  <Menu.Item key="2"
                    onClick={() => props.history.push('/products/type/notepad/')}>
                    Блокноты
                  </Menu.Item>
                  <Menu.Item key="3"
                  onClick={() => props.history.push('/products/type/calendar/')}>
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

const mapStateToProps = state => {
    return {
        username: state.auth.username,
        isAuthenticated: !!state.auth.token
    };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.logout()),
    getUserRoom: (id) => dispatch(locationActions.getUserRoom(id))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomLayout));
