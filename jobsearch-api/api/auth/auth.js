// https://github.com/serverless/examples/tree/master/aws-node-auth0-custom-authorizers-api
// Reusable Authorizer function, set on `authorizer` field in serverless.yml

const jwt = require('jsonwebtoken');

// Set in `environment` of serverless.yml
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_PUBLIC_KEY = process.env.AUTH0_CLIENT_PUBLIC_KEY;

module.exports.auth = (event, context, callback) => {
    console.log('event', event);
    if (!event.authorizationToken) {
      return callback('Unauthorized');
    }
  
    const tokenParts = event.authorizationToken.split(' ');
    const tokenValue = tokenParts[1];
  
    if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
      // no auth token!
      return callback('Unauthorized');
    }
    
    // console.log("AUTH0_CLIENT_ID: " + AUTH0_CLIENT_ID);

    const options = {
      aud: AUTH0_CLIENT_ID,
    };
  
    try {
      jwt.verify(tokenValue, AUTH0_CLIENT_PUBLIC_KEY, options, (verifyError, decoded) => {
        if (verifyError) {
          console.log('verifyError', verifyError);
          // 401 Unauthorized
          console.log(`Token invalid. ${verifyError}`);
          return callback('Unauthorized');
        }
        // is custom authorizer function
        console.log('valid from customAuthorizer', decoded);
        return callback(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
      });
    } catch (err) {
      console.log('catch error. Invalid token', err);
      return callback('Unauthorized');
    }
  };

  // Policy helper function
const generatePolicy = (principalId, effect, resource) => {
    console.log('principalId: ' + principalId);
    const authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
      const policyDocument = {};
      policyDocument.Version = '2012-10-17';
      policyDocument.Statement = [];
      const statementOne = {};
      statementOne.Action = 'execute-api:Invoke';
      statementOne.Effect = effect;
      statementOne.Resource = resource;
      policyDocument.Statement[0] = statementOne;
      authResponse.policyDocument = policyDocument;
    }
    return authResponse;
  };