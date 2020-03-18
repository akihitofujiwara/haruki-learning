import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { keyBy } from 'lodash';

import firebase from '../../firebase';
import AppPage from '../hocs/AppPage';
import useCollectionSubscription from '../hooks/useCollectionSubscription';

const db = firebase.firestore();
const quizzesRef = db.collection('quizzes');
const clearsRef = db.collection('clears');

export default AppPage(function Dashboard (props) {
  const quizzes = useCollectionSubscription(quizzesRef.orderBy('createdAt'));
  const clears = useCollectionSubscription(clearsRef);
  const clearsById = keyBy(clears, 'id');

  return (
    <div className="admin-root h-100 container">
      <div className="d-flex flex-wrap justify-content-around align-items-center">
        {
          quizzes.map((quiz, i) => {
            const isCleared = clearsById[quiz.id] != null;

            return (
              <Link
                to={`/quizzes/${quiz.id}?index=${i}`}
                className="card font-weight-bold rounded-circle p-3 d-flex justify-content-center align-items-center mb-3"
                key={i}
                style={{
                  fontSize: 60,
                  width: 150,
                  height: 150,
                  textDecoration: 'none',
                  opacity: !isCleared && 0.8,
                  color: isCleared ? 'white' : '#343a40',
                  ...(
                    isCleared && {
                      textShadow: '2px 2px 7px black',
                      backgroundImage: 'url(https://images-fe.ssl-images-amazon.com/images/I/512I%2BPOfVzL.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center center',
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      backgroundBlendMode: 'lighten',
                    }
                  )
                }}
              >
                <div>
                  {i + 1}
                </div>
              </Link>
            );
          })
        }
      </div>
    </div>
  );
});
