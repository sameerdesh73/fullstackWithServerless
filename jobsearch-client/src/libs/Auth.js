import auth0 from "auth0-js";
import config from "../config";

export default class Auth {
  accessToken;
  idToken;
  expiresAt;
  userId;

  auth0 = new auth0.WebAuth({
    domain: config.AUTH0_DOMAIN,
    clientID: config.AUTH0_CLIENTID,
    redirectUri: config.AUTH0_CALLBACKURL,
    responseType: "token id_token",
    scope: "openid"
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.renewSession = this.renewSession.bind(this);
  }

  login() {
    console.log("auth0 callback url: " + this.auth0.redirectUri);
    this.auth0.authorize();
  }

  logout() {
    // log out from server
    var logoutOptions = {
      returnTo: config.AUTH0_LOGOUT_URL
    };
    this.auth0.logout(logoutOptions);
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setSession(authResult);
          this.getProfile();
          resolve(authResult);
        } else if (err) {
          console.log("Auth0.js, error inside handleAuthentication:" + err);
          reject(err);
        }
      });
    });
  }

  renewSession() {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem("isLoggedIn") === "true") {
        this.auth0.checkSession({}, (err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult);
            resolve(authResult);
          } else if (err) {
            console.log("Auth0.js, error inside renewSession:" + err);
            reject(err);
          }
        });
      } else {
        resolve(null);
      }
    });
  }

  setSession(authResult) {
    // Set isLoggedIn flag in localStorage
    console.log("setting LocalStorage isLoggingIn to true");
    localStorage.setItem("isLoggedIn", "true");

    // Set the time that the access token will expire at
    let expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;

    // todo: get userId and active jobSearchId and update state
  }

  getProfile() {
    return new Promise((resolve, reject) => {
      this.auth0.client.userInfo(this.accessToken, (err, profile) => {
        if (profile) {
          this.userId = profile.sub;
          console.log('this.userId: ' + this.userId);
          resolve(profile);
        }
        else if (err){
          console.log("Auth0.js, error inside getProfile:" + err);
            reject(err);
        }else {
          resolve(null);
        }
      });
    });
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    console.log("Auth0.js: expiresAt: " + expiresAt);
    return new Date().getTime() < expiresAt;
  }
}
