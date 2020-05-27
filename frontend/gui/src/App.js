import React, {Component} from 'react';
import 'antd/dist/antd.css';
import CustomLayout from './containers/Layout';
import BaseRouter from './routes';
import {BrowserRouter as Router } from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from './store/actions/auth';
import * as locationActions from './store/actions/orderRoom';
import './assets/style.css';
import WebSocketInstance from "./websocket";

class App extends Component {

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  constructor(props) {
    super(props);
    WebSocketInstance.addCallbacks(
        this.props.setLocations.bind(this),
        this.props.setLocations.bind(this)
    );
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
    isAuthenticated: state.auth.token
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    addLocation: location => dispatch(locationActions.addLocation(location)),
    setLocations: locations => dispatch(locationActions.setLocations(locations)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
