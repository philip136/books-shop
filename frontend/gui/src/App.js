import React, {Component} from 'react';
import 'antd/dist/antd.css';
import CustomLayout from './containers/Layout';
import BaseRouter from './routes';
import {BrowserRouter as Router } from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from './store/actions/auth';


class App extends Component {

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

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

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispathToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispathToProps)(App);
