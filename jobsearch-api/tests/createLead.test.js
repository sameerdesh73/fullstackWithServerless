import * as handler from "../api/leads/create";

test("body should have valid json", async () => {
  const event = "event";
  const context = "context";
  const result = await handler.create(event, context);
  console.log(result);
  expect(result.statusCode).toEqual(400);
});

test("body should have valid json", async () => {
  const event =
    '{{ "jobSearchId": "1";"company": "LinkedIn", "jobTitle" : "Engineering Manager" }}';
  const context = "context";
  const result = await handler.create(event, context);
  console.log(result);
  expect(result.statusCode).toEqual(400);
});

test("jobSearchId or userId is required", async () => {
    let eventBody = {"jobSearchId":"","userId":"", "company": "LinkedIn", "jobTitle" : "Engineering Manager" };
    const event = {"body": JSON.stringify(eventBody) };
    
    const data = JSON.parse(event.body);
    console.log('Unit test Event body:' + data);

    const context = "context";
    const result = await handler.create(event, context);
    console.log(result);
    expect(result.statusCode).toEqual(400);
    var body = JSON.parse(result.body);
    expect(body.message).toEqual('Request must include jobSearchId or userId');
  });