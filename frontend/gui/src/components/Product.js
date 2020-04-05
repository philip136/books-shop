import React from 'react'
import LinkProduct from './LinkProduct';
import { Card } from 'antd';



class Product extends React.Component{
  render(){
    const { Meta } = Card;
    let description = `Цена: ${this.props.data.price} BYN`;

    return (
      <div className="product-container">
          <Card
            hoverable
            style={{ width: 240 }}
            cover={<img alt={this.props.data.name} src={this.props.data.image} />}
          >
            <Meta title={this.props.data.name} description={description} />
              <LinkProduct link={`${this.props.data.id}`}/>
          </Card>
      </div>
    );
  }
}

export default Product;