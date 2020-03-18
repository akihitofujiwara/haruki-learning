import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { omit, sortBy, keyBy, pick, } from 'lodash';
import { useToggle } from 'react-use';
import qs from 'qs';

import firebase from '../../firebase';
import AdminPage from '../hocs/AdminPage';
import useCollectionSubscription from '../hooks/useCollectionSubscription';
import QuizFormModal from '../modals/QuizFormModal';
import EditButton from '../EditButton';
import DeleteButton from '../DeleteButton';

const db = firebase.firestore();
const quizzesRef = db.collection('quizzes');

export default AdminPage(function Quizzes (props) {
  const { location: { search } } = props;
  const { isNew } = qs.parse(search.slice(1));
  const quizzes = useCollectionSubscription(quizzesRef.orderBy('createdAt'));
  const [showsFormModal, toggleFormModal] = useToggle(isNew === '1');
  const onSubmitForm = async (values) => {
    try {
      await quizzesRef.add({ ...omit(values, 'id'), createdAt: new Date() });
      toast.success('追加しました');
    } catch(e) {
      toast.error('失敗しました');
      console.error(e);
    }
    toggleFormModal();
  };

  return (
    <div>
      <div className="admin-quizzes container py-5 position-relative bg-white my-3">
        <div className="d-flex justify-content-center mb-3">
          <h4>クイズ一覧</h4>
        </div>
        <div className="d-flex justify-content-end mb-3">
          <Button className="ml-2" color="primary" onClick={toggleFormModal}>
            <span className="fas fa-plus mr-1" />
            追加
          </Button>
        </div>
        <div>
          {
            quizzes.length > 0 ? (
              <table className="table">
                <thead className="thead-light text-center">
                  <tr>
                    <th>本文</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    quizzes.map((quiz) => {
                      const { id, ref, description, createdAt } = quiz;
                      return (
                        <tr key={id}>
                          <td>
                            {description}
                          </td>
                          <td className="text-right">
                            <EditButton itemRef={ref} FormModal={QuizFormModal} />
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
                クイズは未登録です
              </div>
            )
          }
        </div>
        <QuizFormModal isOpen={showsFormModal} onClickClose={toggleFormModal} onSubmit={onSubmitForm} />
      </div>
    </div>
  );
});

