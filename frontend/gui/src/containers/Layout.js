import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

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
            
              <Menu.Item key="1">
                <Link to="/">Главная</Link>
              </Menu.Item>
              <Menu.Item key="2">Новинки</Menu.Item>
              <Menu.Item key="3">Популярное</Menu.Item>
              {
                props.isAuthenticated ?
                
                <Menu.Item key="4">
                  Выйти
                </Menu.Item>
                
                :
                <Menu.Item key="4">
                  <Link to="/login">Авторизация</Link>
                </Menu.Item>
              }
            </Menu>
          </Header>
          <Layout>
            <Sider width={200} className="site-layout-background">
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
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
                  
                  <Menu.Item key="1">Книги</Menu.Item>
                  <Menu.Item key="2">Блокноты</Menu.Item>
                  <Menu.Item key="3">Календари</Menu.Item>
                </SubMenu>
                <SubMenu
                  key="sub2"
                  title={
                    <span>
                      <LaptopOutlined />
                      Ваша корзина
                    </span>
                  }
                >
                  <Menu.Item key="5">Корзина</Menu.Item>
                </SubMenu>
                <SubMenu
                  key="sub3"
                  title={
                    <span>
                      <NotificationOutlined />
                      Доставка
                    </span>
                  }
                >
                  <Menu.Item key="9">Курьеры</Menu.Item>
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

export default CustomLayout;
