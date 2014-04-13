var http = require('http');
var url = require('url');
var connect = require('connect');

exports.start = function start(route, handle){
    var app = connect()
        .use(connect.logger('dev'))
        .use(connect.static('public'))
        .use(function(req, res){
            var pathname = url.parse(req.url).pathname;
            route(handle, pathname, req, res);
        });

        http.createServer(app).listen(3000);
};
