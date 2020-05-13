import React from 'react'
import { Card } from 'antd';
import {Link} from 'react-router-dom';



class Product extends React.Component{
  render(){
    const { Meta } = Card;
    const description = `Цена: ${this.props.data.price} BYN`;

    return (
        <Link to={`/products/${this.props.data.id}/`}>
          <Card
            hoverable
            cover={<img className='image-product' alt={this.props.data.name} src={this.props.data.image} />}
          >
              <div className="additional">
                <h3 className="title">{this.props.data.name} </h3>
                <p className="description-product">{description} </p>
              </div>
          </Card>
       </Link>
    );
  }
}

export default Product;