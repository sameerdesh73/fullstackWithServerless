import React, { Component } from 'react';
import loading from './loading.svg';

class Callback extends Component {

async  componentDidMount() {
    if (/access_token|id_token|error/.test(this.props.location.hash)) {
      try{
        await this.props.auth.handleAuthentication();
        console.log('this.props.auth.idToken: ' + this.props.auth.idToken);
        console.log('this.props.auth.accessToken: ' + this.props.auth.accessToken);
        console.log('this.props.auth.expiresAt: ' + this.props.auth.expiresAt);
      }
      catch(error){
        console.log(error);
      }     

      console.log('callback url: ' + window.location.href);     
      console.log('callback: about to work on redirect');      
      var redirect = localStorage.getItem('redirect');
      console.log('redirect: ' + redirect);
      if (redirect === null || redirect === '') {
        this.props.history.push("/home")
      }
      else{
        console.log('about to remove redirect from local storage');
        localStorage.removeItem('redirect');
        console.log('removed redirect from local storage');
        //alert('check redirect');
        this.props.history.push(redirect);
      }
      console.log('callback: redirection put on history');
    }
  }


  render() {
    const style = {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
    }

    return (
      <div style={style}>
        <img src={loading} alt="loading"/>
      </div>
    );
  }
}

export default Callback;
