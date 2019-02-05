"use strict";

import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure, badRequest, created } from "../libs/response-lib";

const uuid = require("uuid");

export async function list(event, context) {
  try {
    // get currently logged in userId
    var eventjson = JSON.stringify(event.requestContext.authorizer);
    var userId = JSON.parse(eventjson).principalId;
    console.log("userId: " + userId);

    // todo: we may need to get jobSearchId from queryparams if specified for past job searches
    const response = await getActiveJobSearchId(userId);
    if (!response.status) {
      return failure({ status: false, message: response.message });
    } else {
      var result = {};
      if (response.jobSearchId) {
        result.jobSearchId = response.jobSearchId;
        var leadsResponse = await getLeads(response.jobSearchId);
        if (!leadsResponse.status) {
            console.log('Error with leadsResponse');
          return failure({ status: false, message: leadsResponse.message });
        }
        result.leads = leadsResponse.leads;
      }
      console.log('Final Result: ' + result);
      return success(result);
    }
  } catch (e) {
    return failure({ status: false, message: e.message });
  }
}

async function getActiveJobSearchId(userId) {
  let result;
  const params = {
    TableName: process.env.jobSearchTableName,
    IndexName: "userIndex",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    }
  };

  try {
    let response = await dynamoDbLib.call("query", params);
    console.log("Params: " + JSON.stringify(params));
    console.log("Response:" + JSON.stringify(response));

    if (response.Count == 0) {
      result = {
        status: true
      };
    } else if (response.Count == 1) {
      result = {
        status: true,
        jobSearchId: response.Items[0].jobSearchId
      };
    } else if (response.Count > 1) {
      // if more than 1 active records, this is fatal error
      result = {
        status: false,
        message:
          "getActiveJobSearchId: More than 1 active jobSearchId exists for user, corrupt data"
      };
    }
  } catch (e) {
    result = {
      status: false,
      message:
        "getActiveJobSearchId: Error reading from database, error: " + e.message
    };
  }
  return result;
}

async function getLeads(jobSearchId) {
  let result;

  const params = {
    TableName: process.env.leadsTableName,
    IndexName: "jobSearchIndex",
    KeyConditionExpression: "jobSearchId = :jobSearchId",
    ExpressionAttributeValues: {
      ":jobSearchId": jobSearchId
    },
    ProjectionExpression: "leadId, jobSearchId, company, jobTitle" 
  };
  try {
    const response = await dynamoDbLib.call("query", params);
    console.log(
      "Querying jobSearchId: " +
        jobSearchId +
        ", Result: " +
        JSON.stringify(response)
    );
    result = {
      status: true,
      leads: response.Items
    };
  } catch (e) {
      console.log('Exception querying within getLeads');
    result = {
      status: false,
      message: "getLeads: Error querying database, error: " + e.message
    };
  }
  return result;
}
