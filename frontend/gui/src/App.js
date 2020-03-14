import React, {Component} from 'react';
import './App.css';
import 'antd/dist/antd.css';
import CustomLayout from './containers/Layout';
import ProductList from './containers/ProductList';

class App extends Component {
  render(){
    return (
      <div className="App">
        <CustomLayout>
          <ProductList/>
        </CustomLayout>
      </div>
    );
  }
}

export default App;
