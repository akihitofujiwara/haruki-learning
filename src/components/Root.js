import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import firebase from '../firebase';
import Bgm from './Bgm';

const auth = firebase.auth();

export default class Root extends Component {
  componentWillMount() {
  }
  render() {
    return (
      <div className="h-100">
        <BrowserRouter>
          <Bgm>
            {this.props.routes()}
          </Bgm>
        </BrowserRouter>
        <ToastContainer />
      </div>
    );
  }
};
