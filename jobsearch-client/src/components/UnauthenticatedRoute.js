import React from "react";
import { Route, Redirect } from "react-router-dom";
import {querystring} from '../libs/helper';

export default ({ component: C, props: cProps, ...rest }) => {
  const redirect = querystring("redirect");
  console.log('inside UnauthenticatedRoute: cProps.isAuthenticated(): ' + cProps.isAuthenticated);
  return (
    <Route
      {...rest}
      render={props =>
        !cProps.isAuthenticated
          ? <C {...props} {...cProps} />
          : <Redirect
              to={redirect === "" || redirect === null ? "/" : redirect}
            />}
    />
  );
};
