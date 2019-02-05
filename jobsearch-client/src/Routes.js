import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import About from "./containers/About";
import Login from "./containers/Login";
import NewLead from "./containers/NewLead";
import NotFound from "./containers/NotFound";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Callback from "./containers/Callback";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={About} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/callback" exact component={Callback} props={childProps} />
    <AuthenticatedRoute path="/home" exact component={Home} props={childProps} />
    <AuthenticatedRoute path="/leads/new" exact component={NewLead} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;
