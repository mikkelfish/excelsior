//setup Dependencies
var express = require('express')
    , io = require('socket.io')
    , DataSource = require("./datasource")
    , restful = require('node-restful')
    , mongoose = restful.mongoose
    , port = (process.env.PORT || 8888)
    , passport = require('passport')
    , flash = require('connect-flash')
    , JwtStrategy = require('passport-mongoose-jwt').Strategy;

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var serveStatic = require('serve-static');
var errorhandler = require('errorhandler');

//Setup Express
var server = express();
server.use(cookieParser());
server.use(bodyParser());
server.use(session({ secret: 'keyboard cat' }));
server.use(passport.initialize());
server.use(passport.session());

server.use(flash());
server.set('views', __dirname + '/views');
server.set('view options', { layout: false });
server.set('view engine', 'jade');
server.set('view options', { layout: false });
server.use(serveStatic(__dirname + '/static'));
// invoked for any requested passed to this router

//setup the errors
server.use(errorhandler(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: {
            title : '404 - Not Found'
            ,description: ''
            ,author: ''
            ,analyticssiteid: 'XXXXXXX'
        },status: 404 });
    } else {
        console.log('Error ' + err );
        res.render('500.jade', { locals: {
            title : 'The Server Encountered an Error'
            ,description: ''
            ,author: ''
            ,analyticssiteid: 'XXXXXXX'
            ,error: err
        },status: 500 });
    }
}));

var router = express.Router();
router.use(function(req, res, next) {
    if(req.headers.accept.indexOf('text/html') >= 0){
        req.webAccess = true;
    }
    next();
});

server.use(router);




//// Add headers
//server.use(function (req, res, next) {
//
//    // Website you wish to allow to connect
//    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');
//
//    // Request methods you wish to allow
//    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//
//    // Request headers you wish to allow
//    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//
//    // Set to true if you need the website to include cookies in the requests sent
//    // to the API (e.g. in case you use sessions)
//    res.setHeader('Access-Control-Allow-Credentials', true);
//
//    // Pass to next layer of middleware
//    next();
//});

// Configure passport
var User = require('./models/user');
var use = new User();
passport.use(User.createStrategy());
passport.use(User.createJwtStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect mongoose
mongoose.connect('mongodb://localhost/test-users');


server.listen( port);

//var source = new DataSource();
//(function(io, serv) {
//    var lastMessages =[];
//    setInterval(function(){
//       lastMessages = source.get();
//    }, 10000);
////Setup Socket.IO
//    var io = io.listen(serv);
//    io.sockets.on('connection', function (socket) {
//        console.log('Client Connected');
//        setInterval(function () {
//            socket.emit('client', {'messages': lastMessages});
//        }, 10000);
//        socket.on('message', function (data) {
//            socket.broadcast.emit('server_message', data);
//            socket.emit('server_message', data);
//        });
//        socket.on('disconnect', function () {
//            console.log('Client Disconnected.');
//        });
//    });
//})(io, server);


///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

server.post('/data', function(req,res){
    source.add(req.body);
    res.writeHead(200, {"Content-Type":"text/plain"});
    res.write("Hello Upload");
    res.end();
});

// Setup routes
require('./user_routes')(server);

var Movie = require('./models/movie');
require('./restful_routes')(server, Movie, "/movies");

//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://0.0.0.0:' + port );
