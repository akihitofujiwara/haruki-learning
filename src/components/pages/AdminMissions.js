import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { omit, sortBy, keyBy, pick, } from 'lodash';
import { useToggle } from 'react-use';
import qs from 'qs';

import firebase from '../../firebase';
import { fields } from '../../shared/models/mission';
import AdminPage from '../hocs/AdminPage';
import useCollectionSubscription from '../hooks/useCollectionSubscription';
import ModelFormModal from '../modals/ModelFormModal';
import EditButton from '../EditButton';
import AddButton from '../AddButton';
import DeleteButton from '../DeleteButton';

const db = firebase.firestore();
const missionsRef = db.collection('missions');

export default AdminPage(function Quizzes (props) {
  const { location: { search } } = props;
  const { isNew } = qs.parse(search.slice(1));
  const missions = useCollectionSubscription(missionsRef.orderBy('createdAt'));
  const [showsFormModal, toggleFormModal] = useToggle(isNew === '1');
  const onSubmitForm = async (values) => {
    try {
      await missionsRef.add({ ...omit(values, 'id'), createdAt: new Date() });
      toast.success('追加しました');
    } catch(e) {
      toast.error('失敗しました');
      console.error(e);
    }
    toggleFormModal();
  };

  return (
    <div>
      <div className="admin-missions container py-5 position-relative bg-white my-3">
        <div className="d-flex justify-content-center mb-3">
          <h4>ミッション一覧</h4>
        </div>
        <div className="d-flex justify-content-end mb-3">
          <AddButton itemRef={missionsRef.doc()} FormModal={ModelFormModal} formProps={{ title: 'ミッション', fields }} />
        </div>
        <div>
          {
            missions.length > 0 ? (
              <table className="table">
                <thead className="thead-light text-center">
                  <tr>
                    <th>本文</th>
                    <th>ポイント</th>
                    <th>写真</th>
                    <th>状態</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    missions.map((mission) => {
                      const { id, ref, body, point, status, image, createdAt } = mission;
                      return (
                        <tr key={id}>
                          <td>
                            {body}
                          </td>
                          <td className="text-right">
                            {point}
                          </td>
                          <td className="text-right">
                            <a href={image} target="_blank">
                              <img src={image} style={{ maxWidth: 300, maxHeight: 100 }} />
                            </a>
                          </td>
                          <td className="text-right">
                            {status}
                          </td>
                          <td className="text-right">
                            <EditButton itemRef={ref} FormModal={ModelFormModal} formProps={{ title: 'ミッション', fields, }} />
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
                ミッションは未登録です
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
});

