var server = require("./serverbk2");
var router = require("./router");
var requestHandlers = require("./request_handlers");

var handle = {};
handle["/"] = {verbs:["GET"], func : requestHandlers.start};
handle["/data"] = {verbs:["PUT"] ,func: requestHandlers.start};
server.start(router.route, handle);