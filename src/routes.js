import React from 'react';
import { Route, Switch, } from 'react-router';

import AdminRoot from './components/pages/AdminRoot';
import AdminQuizzes from './components/pages/AdminQuizzes';
import Dashboard from './components/pages/Dashboard';
import Quiz from './components/pages/Quiz';

const routeObjs = [
  {
    exact: true,
    path: '/admin',
    component: AdminRoot,
  },
  {
    exact: true,
    path: '/admin/quizzes',
    component: AdminQuizzes,
  },
  {
    exact: true,
    path: '/',
    component: Dashboard,
  },
  {
    exact: true,
    path: '/quizzes/:quizId',
    component: Quiz,
  },
]

export default function routes (extraProps) {
  return (
    <Switch>
      {
        routeObjs.map((route , i) => {
          const { exact, path, render, props } = route;
          return (
            <Route exact={exact} path={path} render={render || (_ =>
              <route.component {..._} {...extraProps} {...props} />
            )} key={i} />
          );
        })
      }
    </Switch>
  );
};
