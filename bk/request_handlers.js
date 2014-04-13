function start(request, response){
    response.writeHead(200, {"Content-Type":"text/plain"});
    response.write("Hello Start");
    response.end();
}

function upload(request, response){
    response.writeHead(200, {"Content-Type":"text/plain"});
    response.write("Hello Upload");
    response.end();
}

exports.start = start;
exports.upload = upload;