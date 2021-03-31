import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PrimaryNav from './PrimaryNav';
import { Fragment } from 'react';

export default function PrivateRoute({ component: Component, authed, ...rest }) {
    return (
        <Route
            {...rest}
            render={({ location }) =>
                authed !== null ? (
                    <Fragment>
                        <PrimaryNav />
                        <div>
                            <Component />
                        </div>
                    </Fragment>
                ) : (
                    <Redirect
                        to={{
                            pathname: '/sign-in',
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
}
