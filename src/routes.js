import React from 'react';
import { Route, Switch, } from 'react-router';

import AdminRoot from './components/pages/AdminRoot';
import AdminQuizzes from './components/pages/AdminQuizzes';
import AdminMissions from './components/pages/AdminMissions';
import AdminGiftTypes from './components/pages/AdminGiftTypes';
import AdminGifts from './components/pages/AdminGifts';
import Dashboard from './components/pages/Dashboard';
import Quiz from './components/pages/Quiz';
import Missions from './components/pages/Missions';

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
    path: '/admin/missions',
    component: AdminMissions,
  },
  {
    exact: true,
    path: '/admin/giftTypes',
    component: AdminGiftTypes,
  },
  {
    exact: true,
    path: '/admin/gifts',
    component: AdminGifts,
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
  {
    exact: true,
    path: '/missions',
    component: Missions,
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
