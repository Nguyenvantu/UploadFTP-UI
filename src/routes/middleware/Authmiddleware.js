import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const Authmiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  redirect,
  ...rest
}) => {
  const isLoggedIn = useSelector(state => state.Login.isLoggedIn);

  return (
    <Route
      // {...rest}
      path={rest.path}
      render={props => {
        if (isAuthProtected && !isLoggedIn) {
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        }
        if (redirect) {
          return (
            <Redirect
              to={{ pathname: redirect, state: { from: props.location } }}
            />
          );
        }
        return (
          <Layout>
            <Component {...props} />
          </Layout>
        );
      }}
    />
  );
};

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
};

export default Authmiddleware;
