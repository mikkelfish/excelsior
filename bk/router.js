function route(handle, pathname, request, response) {
    if (pathname in handle) {
        if(handle[pathname].verbs.indexOf(request.method) < 0){
            response.writeHead(400,{"Content-Type":"text/plain"});
            response.write("400 Verb not supported: " + request.method);
            response.end();
            return;
        }

        //parse object


        handle[pathname].func(request, response);
    }
    else {
        response.writeHead(404,{"Content-Type":"text/plain"});
        response.write("404 Not found");
        response.end();
    }
}
exports.route = route;