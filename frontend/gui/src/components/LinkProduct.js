import React from 'react';
import { Button } from 'antd';


class LinkProduct extends React.Component{
    render(){
        return (
            <div>
                <Button
                 type="primary"
                 href={`/products/${this.props.link}/`}
                 style={{marginTop: '10px'}}
                 >
                    Просмотр
                </Button>
            </div>
        );
    }

}

export default LinkProduct;