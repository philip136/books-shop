import React from 'react'
import LinkProduct from './LinkProduct';


class Product extends React.Component{
  render(){
    return (
      <div className="product-container">
          <div className="product-headline">{this.props.data.name}</div>
          <div className="product-image">
            <img src={this.props.data.image} width='60%' height='auto'></img>
          </div>
          <div className="product-description">
            Количество товаров: {this.props.data.count}  
            Цена: {this.props.data.price} BYN
          </div>
          <LinkProduct link={`/${this.props.data.id}`}/>
      </div>
    );
  }
}

export default Product;