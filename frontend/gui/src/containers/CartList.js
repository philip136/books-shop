import React from 'react';
import { authAxios } from '../utils';
import { myCartUrl, deleteCartItemUrl, updateCartItemUrl } from '../constants';
import { connect } from 'react-redux';
import {Table, Button, Spin, message, Form, Input} from 'antd';
import * as actions from '../store/actions/auth';
import { DeleteOutlined,LoadingOutlined,EditOutlined } from '@ant-design/icons';


const antIcon = <LoadingOutlined style={{fontSize: 24}} />

class CartList extends React.Component{
    state = {
        data: [],
        error: null,
        loading: false,
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
        authAxios
            .get(myCartUrl)
                .then(res => {
                    this.setState({data: res.data, loading: false});
                    this.formatingData(res.data);
                })
                .catch(err => {
                    this.setState({error: err})
                });
    };

    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
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

    formatingData = (data) => {
        const newData = [];
        for (let i=0; i<data.length; i++){
            if (data[i]['products'] !== []){
                const products = data[i]['products'];

                for (let j=0; j<products.length; j++){
                    newData.push({
                        key: `${products[j]['id']}`,
                        name: `${products[j]['product']['name']}`,
                        count: `${products[j]['count']}`,
                        price: `${products[j]['product_total']} руб.`,
                    });
                }
            }
        }
        this.setState({dataTable: newData});
    };

    handleChangeItem = (id, name) => {
        const {changedCount} = this.state;
        const product_name = name;
        const count = changedCount;
        authAxios
            .put(updateCartItemUrl(id), {product_name, count})
            .then(res => {
                this.handleFetchCart();
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
        const { loading, selectedRowKeys, dataTable, columns} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;

        return (
            <div>
                {loading ?
                <Spin indicator={antIcon} />
                :
                <div style={{ marginBottom: 16 }}>
                    <span style={{ marginLeft: 8 }}>
                        {hasSelected ? `Выбрано ${selectedRowKeys.length} продуктов` : ''}
                    </span>
                        <Table dataSource={dataTable} columns={columns} rowSelection={rowSelection} />
                </div>
                }
            </div>
        );
    }
}

const mapDispathToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())
    };
};

export default connect(null, mapDispathToProps)(CartList);