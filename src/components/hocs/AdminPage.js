import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { toast } from 'react-toastify';
import qs from 'qs';

import firebase from '../../firebase';
import AdminHeaderNav from '../AdminHeaderNav';
import SignInForm from '../forms/SignInForm';

const auth = firebase.auth();
const db = firebase.firestore();
const adminUsersRef = db.collection('adminUsers');

export default function AdminPageHOC(WrappedComponent) {
  return class AdminPage extends Component {
    constructor() {
      super();
      this.state = {};
    }
    componentWillMount() {
      auth.onAuthStateChanged((firebaseUser) => {
        if (!firebaseUser) {
          auth.signOut();
          this.setState({ uid: null, email: null, displayName: null });
          this.openLoginModal();
          return;
        }
        const { email, uid, displayName } = firebaseUser;
        this.setState({ uid, email, displayName, firebaseUser });
      });
    }
    signInWithProvider = (providerName) => {
      const provider = new firebase.auth[`${providerName}AuthProvider`]();
      auth.signInWithRedirect(provider);
    }
    openLoginModal() {
      this.setState({ shouldShowLoginForm: true });
    }
    onSetUid() {
      this.listenAdminUser();
      this.updateUser();
    }
    listenAdminUser() {
      const { uid } = this.state;
      adminUsersRef
        .doc(uid)
        .onSnapshot(_ => this.setState({ user: _.data() }));
    }
    async updateUser() {
      const { uid, email, displayName } = this.state;
      const { ref, exists } = await adminUsersRef.doc(uid).get();
      if(!exists) return;
      ref.update({ uid, email, displayName, });
    }
    componentDidUpdate(prevProps, prevState) {
      if (this.state.uid && !prevState.uid) {
        this.onSetUid();
      }
    }
    render() {
      const { firebaseUser, user, shouldShowLoginForm = false } = this.state;
      const onSubmitSignInForm = async (values) => {
        const { email, password } = values;
        try {
          await auth.signInWithEmailAndPassword(email, password);
        } catch(e) {
          console.error(e);
          const message = ({
            'auth/invalid-email': 'メールアドレスの形式が正しくありません',
            'auth/user-not-found': 'ユーザーが存在しません',
          })[e.code] || 'ログインに失敗しました';
          toast.error(message);
        }
      };
      return (
        <div className="admin-page h-100">
          {
            firebaseUser ? (
              user ? (
                <div className="h-100 d-flex flex-column">
                  <AdminHeaderNav {...this.props} />
                  <div className="flex-grow-1 p-5">
                    <WrappedComponent {...this.props} {...{ user }} />
                  </div>
                </div>
              ) : (
                <div>Not authorized. Please get admin invitation.</div>
              )
            ) : (
              shouldShowLoginForm && (
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
                  <div>
                    <Button onClick={this.signInWithProvider.bind(this, 'Google')} block>
                      Googleでログイン
                    </Button>
                  </div>
                  <SignInForm onSubmit={onSubmitSignInForm} />
                </div>
              )
            )
          }
        </div>
      );
    }
  };
};
