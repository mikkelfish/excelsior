var passport = require('passport'),
    User = require('./models/user');

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.render('index', { user : req.user });
    });

    app.get('/register', function(req, res) {
        res.render('register', { });
    });

    app.post('/register', function(req, res) {
        User.register(new User({ username : req.body.username, address: req.body.address, signupDate: new Date() }), req.body.password, function(err, user) {
            if (err) {
                return res.render('register', { user : user });
            }

            passport.authenticate('local')(req, res, function () {
                res.redirect('/');
            });
        });
    });

    app.get('/login', function(req, res) {
        res.render('login', { user : req.user, message: req.flash('error') });
    });

//    app.post('/login', passport.authenticate('local', { successRedirect: '/',
//        failureRedirect: '/login',
//        failureFlash: true })
//    );

    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { req.flash('error', info.message); return next(err); }
            if (!user) {
                res.status(401);
                if(req.webAccess){
                    req.flash('error', info.message);
                    return res.redirect('/login');
                }
                return res.send({user: null, error: info.message}); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }

                if(req.webAccess){
                    return res.redirect('/');
                }
                return res.send( {user: user.toResponse()});
            });
        })(req, res, next);
    });

    app.post('/request_token', function(req, res, next) {
        passport.authenticate('local', { session: false }, function(err, user, info) {
            if (err) { return next(err); }
            if (!user) {
                res.status(401);
                return res.send({token: null, error: info.message});
            }

            User.createToken(user.username, {username: user.username}, 60*24, function(err, token){
                if (err) { return next(err); }
                res.send({token: token});
            });
        })(req, res, next);
    });

    app.post('/login_with_token', function(req, res, next) {
        passport.authenticate('jwt', { session: false, searchClass: new User() }, function(err, user, info) {
            if (err) { return next(err); }
            if (!user) {
                res.status(401);
                return res.send({token: null, error: info.message});
            }

            res.send({success:true});
        })(req, res, next);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};