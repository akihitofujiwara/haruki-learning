import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Button } from 'reactstrap';

import firebase from '../firebase';

const db = firebase.firestore();
const usersRef = db.collection('users');

export default class HeaderNav extends Component {
  render() {
    return (
      <header className="header-nav">
        <Navbar color="dark" dark expand="md">
          <Link to="/admin" className="navbar-brand">
            Haruki Learning Admin
          </Link>
        </Navbar>
      </header>
    );
  }
};
