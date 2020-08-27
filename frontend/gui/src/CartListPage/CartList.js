import React from 'react';
import { authAxios } from '../utils';
import { myCartUrl, deleteCartItemUrl, updateCartItemUrl } from '../constants';
import { connect } from 'react-redux';
import {Table, Button, Spin, message, Form, Input} from 'antd';
import * as actions from '../_store/actions/auth';
import { DeleteOutlined,LoadingOutlined,EditOutlined } from '@ant-design/icons';
import { Redirect } from "react-router-dom";


const antIcon = <LoadingOutlined style={{fontSize: 24}} />

class CartList extends React.Component{
    state = {
        error: null,
        loading: false,
        total: 0,
        showPopup: false,
        changedCount: null,
        selectedRowKeys: [],
        dataTable: [],
        columns: [
            {title: 'Продукт',dataIndex: 'name',key: 'name',},
            {title: 'Количество',dataIndex: 'count',key: 'count', editable: true,
            render: (text,record) =>  this.state.showPopup ?
                (<Input type='number' defaultValue={record.count} min='1' step='1'
                onChange={(e) => this.changeCount(e.target.value)} />) : (text), },
            {title: 'Стоимость',dataIndex: 'price',key: 'price',},
            {title: 'Изменить', dataIndex: '', key: 'update',
                render: (product) => <a onClick={() => this.openChange(product)}>
                <EditOutlined /></a>
            },
            {title: 'Удалить',dataIndex: '',key: 'del',
                render: (product) => <a onClick={() => this.handleRemoveItem(product.key)}>
                  <DeleteOutlined /></a>,
            },
          ],
    };

    componentDidMount(){
        this.handleFetchCart();
    };

    handleFetchCart = () => {
        this.setState({loading: true});
        authAxios()
            .get(myCartUrl(this.props.username))
                .then(res => {
                    const data = res.data.products.map((product) => {
                        return {
                            key: product.id,
                            count: product.count,
                            price: product.product_total,
                            name: product.product.name
                        }

                    })
                    this.setState({
                        data: res.data,
                        total: res.data.cart_total,
                        dataTable: data,
                        loading: false
                    });
                })
                .catch(err => {
                    this.setState({error: err})
                })
    };

    start = () => {
        this.setState({ loading: true });
        setTimeout(() => {
          this.setState({
            selectedRowKeys: [],
            loading: false,
          });
        }, 1000);
    };

    changeCount = (value) => {
        this.setState({changedCount: value});
    };

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };

    handleChangeItem = (id, name) => {
        const {changedCount} = this.state;
        const product_name = name;
        const count = changedCount;
        authAxios
            .put(updateCartItemUrl(id), {product_name, count})
            .then(res => {
                this.handleFetchCart();
                message.success(res.data.message)
            })
            .catch(err => {
                this.setState({error: err});
            });
        };

    openChange = (product_id) => {
        if (!this.state.showPopup){this.setState({showPopup: true});}
        else {this.setState({showPopup: false});
            if (this.state.changedCount != null){
                this.handleChangeItem(product_id.key, product_id.name);
            }
        }
    };

    handleRemoveItem = (product_id) => {
        authAxios
        .delete(deleteCartItemUrl(product_id))
            .then(res => {
                this.handleFetchCart();
            })
            .catch(err => {
                this.setState({error: err});
            });
    };
    

    render() {
        if (this.props.token === null){
            return <Redirect to="/login/" />;
        }

        const { loading, selectedRowKeys, dataTable, total, columns} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        const orderSuccess = localStorage.getItem('orderSuccess');

        return (
            <div>
                {loading ?
                <Spin indicator={antIcon} />
                :
                <div style={{ marginBottom: 16 }}>
                    {orderSuccess ?
                        <div>
                            <p>Ваша корзина пуста </p>
                        </div>
                    :
                    <div>
                    <span style={{ marginLeft: 8 }}>
                        {hasSelected ? `Выбрано ${selectedRowKeys.length} продуктов` : ''}
                    </span>
                        <Table dataSource={dataTable} columns={columns} rowSelection={rowSelection}
                        footer={() => `Итого: ${total}руб`}
                        />
                    <Button href="/my-order/" type="primary">Оформить заказ</Button>
                    </div>
                    }
                </div>

                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        username: state.auth.username,
        token: state.auth.token
    }
}


export default connect(mapStateToProps)(CartList);