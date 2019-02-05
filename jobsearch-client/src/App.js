import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import "./App.css";
import Auth from './libs/Auth';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticating: true,
      auth: new Auth()
    };
  }

  async componentWillMount() {
    try{
      console.log('about to renew session');
      await this.state.auth.renewSession();
      this.setState({ isAuthenticating: false });
      console.log('try: set this.state.isAuthenticating to false');
    }
    catch(error){
      console.log(error);
    }
    finally{
      this.setState({ isAuthenticating: false });
      console.log('finally: set this.state.isAuthenticating to false');
    }
  }

  isAuthenticated() {
    if (this.state.auth && this.state.auth.expiresAt){
      return this.state.auth.isAuthenticated();
    }
    else{
      return false;
    }
  }

  handleLogout = async event => {
    this.state.auth.logout();
    localStorage.removeItem('isLoggedIn');
    //his.props.history.push("/login");
  }

  render() {
    console.log('app.js render isAuthenticated: '+ this.isAuthenticated());
    console.log('this.state.isAuthenticating: ' + this.state.isAuthenticating);
    const childProps = {
      isAuthenticated: this.state.auth.isAuthenticated(),
      auth: this.state.auth
    };

    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Scratch</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {this.isAuthenticated()
                ? <Fragment>
                    <NavItem onClick={this.handleLogout}>Logout</NavItem>
                  </Fragment>
                : <Fragment>
                    <LinkContainer to="/login">
                      <NavItem>Login</NavItem>
                    </LinkContainer>
                  </Fragment>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);
