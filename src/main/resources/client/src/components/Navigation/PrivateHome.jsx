import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';
import Profile from '../Dashboard/Profile/Profile';
import HomePage from '../Home/HomePage';
import PrimaryNav from './PrimaryNav';

export default function PrivateRoute({authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={() =>
        authed !== null ? (
          <Fragment>
            <PrimaryNav />
            <div>
              <Profile />
            </div>
          </Fragment>
        ) : (
          <HomePage />
        )
      }
    />
  );
}
