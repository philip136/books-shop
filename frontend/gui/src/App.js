import React, {Component} from 'react';
import 'antd/dist/antd.css';
import CustomLayout from './_components/Layout';
import BaseRouter from './routes';
import {BrowserRouter as Router } from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from './_store/actions/auth/auth';
import * as locationActions from './_store/actions/orderRoom/orderRoom';
import './assets/style.css';
import WebSocketInstance from "./websocket";

class App extends Component {
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
          <CustomLayout>
            <BaseRouter />
          </CustomLayout>
        </Router>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addLocation: location => dispatch(locationActions.addLocation(location)),
    setLocations: locations => dispatch(locationActions.setLocations(locations)),
  };
};

export default connect(mapDispatchToProps)(App);
