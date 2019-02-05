import AWS from "aws-sdk";
const dynamodbClient = require("serverless-dynamodb-client");

export function call(action, params) {
  const dynamoDb = dynamodbClient.doc;
  return dynamoDb[action](params).promise();
}
