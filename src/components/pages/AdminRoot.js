import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AdminPage from '../hocs/AdminPage';

export default AdminPage(class AdminRoot extends Component {
  render () {
    return (
      <div className="admin-root h-100 container">
        <div className="row">
          <div className="col-sm-6 offset-sm-3">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link" to="/admin/quizzes">クイズ管理</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/missions">ミッション管理</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/giftTypes">ギフトタイプ管理</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/gifts">ギフト管理</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});
