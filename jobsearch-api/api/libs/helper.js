export function isJson(body){
    let result;
    console.log("about to parse body");
    try {
      JSON.parse(body);
      result = true;
    } catch (e) {
      console.error("Validation Failed: " + e.message);
      result = false;
      //return badRequest({ status: false, message: "request body is not json" });
    }
    console.log("parsed body");   
    return result;
}