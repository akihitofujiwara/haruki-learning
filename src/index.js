import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import Root from './components/Root';
import routes from './routes';
import './firebase';

import './index.css';

ReactDOM.render(
  <Root routes={routes} />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
