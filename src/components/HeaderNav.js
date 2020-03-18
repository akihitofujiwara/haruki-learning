import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Button } from 'reactstrap';

import firebase from '../firebase';

const db = firebase.firestore();

export default class HeaderNav extends Component {
  render() {
    return (
      <header className="header-nav">
        <Navbar expand="md" color="primary" dark>
          <Link to="/" className="navbar-brand">
            Haruki Learning
          </Link>
        </Navbar>
      </header>
    );
  }
};

