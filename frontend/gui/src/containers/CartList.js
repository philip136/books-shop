import React from 'react';
import { authAxios } from '../utils';
import { myCartUrl } from '../constants';
import { connect } from 'react-redux';
import { Table, Button, Spin } from 'antd';
import * as actions from '../store/actions/auth';
import { DeleteOutlined,LoadingOutlined } from '@ant-design/icons';



const columns = [
    {
      title: 'Продукт',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Количество',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'Стоимость',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Действия',
      dataIndex: '',
      key: 'del',
      render: () => <a><DeleteOutlined /></a>,
    },
  ];

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} />


class CartList extends React.Component{
    state = {
        data: [],
        error: null,
        loading: false,
        selectedRowKeys: [],
        dataTable: [],
    };

    componentDidMount(){
        this.handleFetchCart();
    }

    handleFetchCart = () => {
        this.setState({loading: true});
        authAxios
            .get(myCartUrl, {responseType: 'json'})
                .then(res => {
                    this.setState({data: res.data, loading: false});
                    this.getDate(res.data);
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

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };

    getDate = (data) => {
        const newData = [];
        for (let i=0; i<data.length; i++){
            if (data[i]['products'] !== []){
                const products = data[i]['products'];

                for (let j=0; j<products.length; j++){
                    newData.push({
                        key: i,
                        name: `${products[j]['product']['name']}`,
                        count: `${products[j]['count']}`,
                        price: `${products[j]['product_total']} руб.`,
                    });
                }
            }
        }
        this.setState({dataTable: newData});
    };
    

    render() {
        const { loading, selectedRowKeys, dataTable } = this.state;
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