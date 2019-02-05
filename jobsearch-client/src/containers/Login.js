import React, { Component } from "react";
//import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
//import LoaderButton from "../components/LoaderButton";
import "./Login.css";
import {querystring} from '../libs/helper';


export default class Login extends Component {

  login = async event => {
    event.preventDefault();

    if (!this.props.isAuthenticated){
      const redirect = querystring("redirect");
      if (!(redirect === "" || redirect === null))
      {
        localStorage.setItem('redirect', redirect ) ;
        console.log('login: added redirect to localstarge');
      }
    }

    try {
      console.log('started login');
      await this.props.auth.login();
      console.log('completed login');
    } catch (e) {
      alert(e.message);
    }
  }

  render() {
    return (
      <div>
        Login with Linkedin...
        <button onClick={this.login}>
          Login
        </button>
      </div>
    );
  }
}
