import React, {Component} from 'react';
import './App.css';
import 'antd/dist/antd.css';
import CustomLayout from './containers/Layout';
import BaseRouter from './routes';
import {BrowserRouter as Router } from 'react-router-dom';
import {connect} from 'react-redux';



class App extends Component {
  render(){
    return (
      <div>
        <Router>
          <CustomLayout {...this.props}>
            <BaseRouter />
          </CustomLayout>
        </Router>
      </div>
    );
  }
}

mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null
  }
}

export default connect(mapStateToProps)(App);
