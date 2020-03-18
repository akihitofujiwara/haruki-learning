import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import qs from 'qs';

import firebase from '../../firebase';
import AppPage from '../hocs/AppPage';
import useDocumentSubscription from '../hooks/useDocumentSubscription';

const db = firebase.firestore();
const quizzesRef = db.collection('quizzes');
const clearsRef = db.collection('clears');

export default AppPage(function Quiz (props) {
  const { match: { params: { quizId } } } = props;
  const { index } = qs.parse(window.location.search.slice(1));
  const quiz = useDocumentSubscription(quizzesRef.doc(quizId), [quizId]);
  const [answerResult, setAnswerResult] = useState();
  const onClickAnswer = async (index) => {
    const number = index + 1;
    const answerResult = number === quiz.correctNumber;
    setAnswerResult(answerResult);
    if(answerResult === true) {
      await clearsRef.doc(quizId).set({
        createdAt: new Date(),
        quizId,
      });
    }
  };

  return quiz != null && (
    <div className="quiz h-100 container">
      <div className="d-flex">
        <Link to="/" className="text-secondary" style={{ fontSize: 20 }}>
          &lt;
          もどる
        </Link>
      </div>
      <div className="mb-4 d-flex justify-content-center">
        <div style={{ fontSize: 60 }}>
          {parseInt(index, 10) + 1}
        </div>
      </div>
      {
        answerResult == null ? (
          <div>
            <div className="mb-4" style={{ fontSize: 40 }}>
              {quiz.description}
            </div>
            <div>
              {
                quiz.optionsString.split(/\n/).map((option, i) => {
                  return (
                    <div className="card p-3 mb-3" style={{ fontSize: 30, opacity: 0.7 }} onClick={onClickAnswer.bind(null, i)}>
                      {option}
                    </div>
                  );
                })
              }
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-center" style={{ fontSize: 70 }}>
            {
              answerResult === true ? (
                <div>
                  せいかい！
                </div>
              ) : (
                <div>
                  まちがい...
                </div>
              )
            }
          </div>
        )
      }
    </div>
  );
});

