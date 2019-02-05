"use strict";

import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure, badRequest, created } from "../libs/response-lib";
import { isJson } from "../libs/helper";

const uuid = require("uuid");

export async function create(event, context) {
  // Verify that json is valid
  if (!isJson(event.body))
    return badRequest({ status: false, message: "Request body is not json" });

  const data = JSON.parse(event.body);
  console.log("Event body:" + data);

  // Verify that jobSearchId or userId is provided
  if (!verifyjobSearchIdOruserIdProvided(data)){
    return badRequest({
      status: false,
      message: "Request must include jobSearchId or userId"
    });
  }

  // if jobSearchId is not provided....
  if (!data.jobSearchId && data.userId) {
    // Verify that jobSearchId does not exist for userId
    const response = await verifyifjobSearchIdExistsForuserId(data);
    if (response.status == false) {
      return badRequest({ status: false, message: response.message });
    }

    // jobSearchId does not exist, this is very first time, create one
    const result2 = await createJobSearchId(data);
    if (result2.status == false) {
      return badRequest({ status: false, message: result2.message });
    }
    console.log("JobSearchId created: " + data.jobSearchId);
  }

  // create lead
  const result = await createLead(data);
  if (result.status == false) {
    return failure({ status: false, message: result.message });
  }
  return created(result.params.Item);
}

function verifyjobSearchIdOruserIdProvided(data) {
  let result = true;
  if (!data.jobSearchId && !data.userId) {
    result = false;
  }
  return result;
}

async function verifyifjobSearchIdExistsForuserId(data) {
  let result;

  // todo: need to modify below params for active (open) jobsearchid meaning non empty start but empty end

  const params = {
    TableName: process.env.jobSearchTableName,
    IndexName: "userIndex",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": data.userId
    }
  };
  try {
    const response = await dynamoDbLib.call("query", params);
    console.log(
      "Querying userId: " + data.userId + ", Result: " + JSON.stringify(response)
    );
    if (response.Count == 0) {
      result = { status: true };
    } else if (response.Count == 1) {
      // API request must provided jobSearchId
      result = {
        status: false,
        message:
          "Active jobSearchId exists, API request body must include jobSearchId and not userId"
      };
    } else {
      // if more than 1 active records, this is fatal error
      result = {
        status: false,
        message: "More than 1 active jobSearchId exists for user, corrupt data"
      };
    }
  } catch (e) {
    result = {
      status: false,
      message: "Error querying database, error: " + e.message
    };
  }
  return result;
}

async function createJobSearchId(data) {
  const timestamp = new Date().getTime();
  const params = {
    TableName: process.env.jobSearchTableName,
    Item: {
      jobSearchId: uuid.v1(),
      userId: data.userId,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };

  let result;

  try {
    await dynamoDbLib.call("put", params);
    console.log("Params: " + JSON.stringify(params));
    console.log("Result:" + JSON.stringify(result));
    console.log(
      "created jobSearchId: " +
        params.Item.jobSearchId +
        " for userid: " +
        params.Item.userId
    );
    data.jobSearchId = params.Item.jobSearchId;
    result = { status: true };
  } catch (e) {
    result = {
      status: false,
      message: "Error writing to database, error: " + e.message
    };
  }
  return result;
}

async function createLead(data) {
  console.log("Leads TableName: " + process.env.leadsTableName);

  const timestamp = new Date().getTime();
  const params = {
    TableName: process.env.leadsTableName,
    Item: {
      leadId: uuid.v1(),
      jobSearchId: data.jobSearchId,
      company: data.company,
      jobTitle: data.jobTitle,
      jobUrl: data.jobUrl,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };

  let result;

  try {
    await dynamoDbLib.call("put", params);
    console.log("Params: " + JSON.stringify(params));
    console.log("Result:" + JSON.stringify(result));
    console.log(
      "created jobSearchId: " +
        params.Item.jobSearchId +
        " for userid: " +
        params.Item.userId
    );
    data.jobSearchId = params.Item.jobSearchId;
    result = { status: true, params: params };
  } catch (e) {
    result = {
      status: false,
      message: "Error writing to database, error: " + e.message
    };
  }
  return result;
}
