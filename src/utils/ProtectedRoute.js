import React from 'react';
import { Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom'

export default function ProtectedRoute({ component: Component, currentUser, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
            currentUser ? (
            <Component {...props} {...currentUser}/>
          ) : (
            <Redirect to="/"/>
          )
        }
      />
    );
  }