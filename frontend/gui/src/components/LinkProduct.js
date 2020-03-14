import React from 'react';
import { Button } from 'antd';


class LinkProduct extends React.Component{
    render(){
        return (
            <div>
                <Button type="primary">
                    Просмотр
                    <a href={`/${this.props.link}`}></a>
                </Button>
            </div>
        );
    }

}

export default LinkProduct;