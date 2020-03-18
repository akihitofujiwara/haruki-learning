import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import firebase from '../firebase';

const auth = firebase.auth();

export default class Root extends Component {
  componentWillMount() {
  }
  render() {
    return (
      <div className="h-100">
        <BrowserRouter>
          {this.props.routes()}
        </BrowserRouter>
        <ToastContainer />
      </div>
    );
  }
};
