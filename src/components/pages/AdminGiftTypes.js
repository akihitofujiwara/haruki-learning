import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { omit, sortBy, keyBy, pick, } from 'lodash';
import { useToggle } from 'react-use';
import qs from 'qs';

import firebase from '../../firebase';
import { fields } from '../../shared/models/giftType';
import AdminPage from '../hocs/AdminPage';
import useCollectionSubscription from '../hooks/useCollectionSubscription';
import ModelFormModal from '../modals/ModelFormModal';
import EditButton from '../EditButton';
import AddButton from '../AddButton';
import DeleteButton from '../DeleteButton';

const db = firebase.firestore();
const giftTypesRef = db.collection('giftTypes');

export default AdminPage(function AdminGiftTypes (props) {
  const giftTypes = useCollectionSubscription(giftTypesRef.orderBy('createdAt'));

  return (
    <div>
      <div className="admin-giftTypes container py-5 position-relative bg-white my-3">
        <div className="d-flex justify-content-center mb-3">
          <h4>ギフトタイプ一覧</h4>
        </div>
        <div className="d-flex justify-content-end mb-3">
          <AddButton itemRef={giftTypesRef.doc()} FormModal={ModelFormModal} formProps={{ title: 'ギフトタイプ', fields }} />
        </div>
        <div>
          {
            giftTypes.length > 0 ? (
              <table className="table">
                <thead className="thead-light text-center">
                  <tr>
                    <th>名称</th>
                    <th>ポイント</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    giftTypes.map((giftType) => {
                      const { id, ref, name, point, createdAt } = giftType;
                      return (
                        <tr key={id}>
                          <td>
                            {name}
                          </td>
                          <td className="text-right">
                            {point}
                          </td>
                          <td className="text-right">
                            <EditButton itemRef={ref} FormModal={ModelFormModal} formProps={{ title: 'ギフトタイプ', fields, }} />
                            <DeleteButton itemRef={ref} className="ml-2" />
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            ) : (
              <div>
                ギフトタイプは未登録です
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
});
