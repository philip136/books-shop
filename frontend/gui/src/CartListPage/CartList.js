import React from 'react';
import { connect } from 'react-redux';
import {Table, Button, Spin,
message,Result, Form, Input, InputNumber, Popconfirm} from 'antd';
import * as cartActions from '../_store/actions/cart/cart';
import {antIcon} from '../LoginPage/Login';
import { SmileOutlined } from '@ant-design/icons';


const mapState = (state) => {
    return {
        token: state.auth.token,
        username: state.auth.username,
        loading: state.cart.loading,
        message: state.cart.message,
        cart: state.cart.cart,
        error: state.cart.error,
        loading: state.cart.loading,
        confirming: state.cart.confirming,
        declining: state.cart.declining,
        orderSuccess: state.location.orderSuccess,
    };
}

const mapDispatch = (dispatch) => ({
    fetchCart: async (username) => dispatch(
        cartActions.fetchCart(username)
    ),
    removeProduct: async (productId) => dispatch(
        cartActions.removeProductFromCart(productId)
    ),
    updateProduct: async (productId, productName, newCount) => dispatch(
        cartActions.updateProductInCart(productId, productName, newCount)
    ),
});

const connector = connect(mapState, mapDispatch);


const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: 'Пожалуйста введите желаемое кол-во товаров!'
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
                ) : (
                    children
                )
            } 
        </td>
    );
};




class CartList extends React.Component {
    formRef =  React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            editingKey: '',
            columns: [
                {title: 'Продукт', render: (record) => record.name},
                {title: 'Количество', dataIndex: 'count', editable: true},
                {title: 'Стоимость', render: (record) =>  record.price},
                {title: 'Изменить', render: (_, record) => {
                    console.log(record);
                    const editable = this.isEditing(record);
                    return editable ? (
                        <span>
                            <a
                                onClick={() => this.saveEdit(record.key)}
                                style={{marginRight: 8}}
                            >
                                Сохранить
                            </a>
                            <Popconfirm 
                                title="Вы действительно хотите закрыть?"
                                cancelText="Нет"
                                okText="Да"
                                onConfirm={this.cancelEdit}
                            >
                                <a> Закрыть </a>
                            </Popconfirm>
                        </span>
                    ) : (
                        <a disabled={this.state.editingKey !== ''} onClick={() =>
                            this.editCountField(record)}
                        >
                            Изменить
                        </a>
                    );
                 }
              },
              {title: 'Удалить', render: (text, record) => {
                return (
                    this.props.cart && (
                        this.props.cart.products.length >= 1 ? (
                            
                            <Popconfirm
                                title='Вы действительно хотите удалить?'
                                cancelText="Нет"
                                okText="Да"
                                onConfirm={() => this.handleDelete(record.key)}
                            >
                               <a> Удалить </a> 
                            </Popconfirm>
                        ) : null
                    )
                );
              }
            },
            ],
        orderSuccess: false,
        };
    }

    componentDidMount() {
        this.props.fetchCart(this.props.username);
        const orderSuccess = localStorage.getItem('orderSuccess');
        this.setState({
            orderSuccess: orderSuccess
        });
    }
    isEditing = (record) => record.key === this.state.editingKey

    editCountField = (record) => {
        const form = this.formRef.current;
        form.setFieldsValue({
            count: '',
            ...record,
        });
        this.setState({
            editingKey: record.key,
        });
    };

    handleDelete = (key) => {
        this.props.removeProduct(key);
    };

    cancelEdit = () => {
        this.setState({editingKey: ''});
    }

    saveEdit = async (key) => {
        const form = this.formRef.current;
        try {
            console.log(key);
            const row = await (form.validateFields());
            const productName = this.props.cart.products.map(product => {
                if (product.id === key) 
                    {
                        return product.product_name
                    }
            })[0]
            const newCount = row.count;
            const productId = key;
            this.props.updateProduct(productId, productName, newCount);
            this.setState({editingKey: ''});
        } catch (err) {
            console.log("Данные введены некорректно");
        }
    };

    insertToDataTable = (products) => {
        const data = []
        products.map(p => {
            const product =  {
                key: p.id,
                name: p.product_name,
                price: p.product_total,
                count: p.count
            };
            data.push(product);
        });
        return data;
    }

    render() {
        const {cart} = this.props;
        const {columns} = this.state;
        const {loading} = this.props;
        const orderSuccess = JSON.parse(localStorage.getItem('orderSuccess'));

        const mergedColumns = columns.map(col => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'count' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record)
                }),
            };
        })

        return (

            <div>

                {orderSuccess ? (
                    <Result
                        icon={<SmileOutlined />}
                        title="Ваша корзина пуста, так как вы уже оформили заказ"
                        extra={<Button href='/' type="primary">Вернуться</Button>}
                    />
                ) :
                (cart &&
                    (<Form ref={this.formRef} component={false}>
                            <Table
                            components={{
                                body: {
                                    cell: EditableCell
                                },
                            }}
                            bordered
                            dataSource={this.insertToDataTable(cart.products)}
                            columns={mergedColumns}
                            rowClassName="editable-row"
                            pagination={{
                                onChange: this.cancelEdit,
                            }}
                        />
                        <Button href="/my-order/" type="primary">Оформить заказ</Button>
                    </Form>)
                )
               }
            </div>
        );
    }
};


const connectedCartList = connector(CartList);
export default connectedCartList;
