import React, {Component} from 'react';
import './App.css';
import 'antd/dist/antd.css';
import CustomLayout from './containers/Layout';
import ProductsList from './containers/ProductsView';

class App extends Component {
  render(){
    return (
      <div className="App">
        <CustomLayout>
          <ProductsList/>
        </CustomLayout>
      </div>
    );
  }
}

export default App;
