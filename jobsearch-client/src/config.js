const local = {
  AUTH0_DOMAIN: "caryeer-us.auth0.com",
  AUTH0_CLIENTID: "2JQbpMVTRCC3A09JM90Pq_StIwZX1L6s",
  AUTH0_CALLBACKURL: "http://localhost:3000/callback",
  AUTH0_LOGOUT_URL: "http://localhost:3000/login",
  JOBSEARCH_API_URL: "http://localhost:4000/leads",
  JOBSEARCH_API_KEY: "d41d8cd98f00b204e9800998ecf8427e"
};

const localWithProdAPI = {
  AUTH0_DOMAIN: "caryeer-us.auth0.com",
  AUTH0_CLIENTID: "2JQbpMVTRCC3A09JM90Pq_StIwZX1L6s",
  AUTH0_CALLBACKURL: "http://localhost:3000/callback",
  AUTH0_LOGOUT_URL: "http://localhost:3000/login",
  JOBSEARCH_API_URL: "https://api.caryeer.com/dev/leads",
  JOBSEARCH_API_KEY: "7GhYg1gaqJaKwFN7NNPEaik35om3gbh319JeHjr9"
};

const dev = {
  AUTH0_DOMAIN: "caryeer-us.auth0.com",
  AUTH0_CLIENTID: "2JQbpMVTRCC3A09JM90Pq_StIwZX1L6s",
  AUTH0_CALLBACKURL: "http://test-jobsearch-client.s3-website-us-east-1.amazonaws.com/callback",
  AUTH0_LOGOUT_URL: "http://test-jobsearch-client.s3-website-us-east-1.amazonaws.com/login",
  //AUTH0_CALLBACKURL: "https://jobsearch.caryeer.com/callback",
  JOBSEARCH_API_URL: "https://api.caryeer.com/dev/leads",
  JOBSEARCH_API_KEY: "7GhYg1gaqJaKwFN7NNPEaik35om3gbh319JeHjr9"
};

// const prodhttp = {
//   AUTH0_DOMAIN: "caryeer-us.auth0.com",
//   AUTH0_CLIENTID: "2JQbpMVTRCC3A09JM90Pq_StIwZX1L6s",
//   AUTH0_CALLBACKURL: "http://jobsearch.caryeer.com/callback",
//   AUTH0_LOGOUT_URL: "http://jobsearch.caryeer.com/login",
//   JOBSEARCH_API_URL: "https://api.caryeer.com/dev/leads",
//   JOBSEARCH_API_KEY: "7GhYg1gaqJaKwFN7NNPEaik35om3gbh319JeHjr9"
// };


const prod = {
  AUTH0_DOMAIN: "caryeer-us.auth0.com",
  AUTH0_CLIENTID: "2JQbpMVTRCC3A09JM90Pq_StIwZX1L6s",
  AUTH0_CALLBACKURL: "https://jobsearch.caryeer.com/callback",
  AUTH0_LOGOUT_URL: "https://jobsearch.caryeer.com/login",
  JOBSEARCH_API_URL: "https://api.caryeer.com/dev/leads",
  JOBSEARCH_API_KEY: "7GhYg1gaqJaKwFN7NNPEaik35om3gbh319JeHjr9"
};

// Default to dev if not set
var env = process.env.REACT_APP_STAGE.trim();

var config;
switch (env){
  case 'localWithProdAPI':
    config = localWithProdAPI;
    break;
  case 'dev':
    config = dev;
    break;
  case 'prod':
    config = prod;
    break;
  default:
    config = local;
}

console.log('Env: ' + env);
console.log('Auth0 URL: ' + config.AUTH0_LOGOUT_URL + ', API URL: ' + config.JOBSEARCH_API_URL)

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
