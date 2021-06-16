import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { get, omit, sortBy, keyBy, pick, } from 'lodash';
import { useToggle } from 'react-use';
import qs from 'qs';

import firebase from '../../firebase';
import { fields } from '../../shared/models/gift';
import AdminPage from '../hocs/AdminPage';
import useCollectionSubscription from '../hooks/useCollectionSubscription';
import ModelFormModal from '../modals/ModelFormModal';
import EditButton from '../EditButton';
import AddButton from '../AddButton';
import DeleteButton from '../DeleteButton';

const db = firebase.firestore();
const giftTypesRef = db.collection('giftTypes');
const giftsRef = db.collection('gifts');

export default AdminPage(function AdminGifts (props) {
  const giftTypes = useCollectionSubscription(giftTypesRef.orderBy('createdAt'));
  const giftTypesById = keyBy(giftTypes, 'id');
  const gifts = useCollectionSubscription(giftsRef.orderBy('createdAt'));

  return (
    <div>
      <div className="admin-gifts container py-5 position-relative bg-white my-3">
        <div className="d-flex justify-content-center mb-3">
          <h4>ギフト一覧</h4>
        </div>
        <div className="d-flex justify-content-end mb-3">
          <AddButton itemRef={giftsRef.doc()} FormModal={ModelFormModal} formProps={{ title: 'ギフト', fields: fields({ giftTypes }), }} />
        </div>
        <div>
          {
            gifts.length > 0 ? (
              <table className="table">
                <thead className="thead-light text-center">
                  <tr>
                    <th>ギフトタイプ</th>
                    <th>状態</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    gifts.map((gift) => {
                      const { id, ref, giftTypeId, status, createdAt } = gift;
                      return (
                        <tr key={id}>
                          <td>
                            {get(giftTypesById, [giftTypeId, 'name'])}
                          </td>
                          <td>
                            {status}
                          </td>
                          <td className="text-right">
                            <EditButton itemRef={ref} FormModal={ModelFormModal} formProps={{ title: 'ギフト', fields: fields({ giftTypes }), }} />
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
                ギフトは未登録です
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
});
