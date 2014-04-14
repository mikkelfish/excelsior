var Movie = require('./models/movie'),
    common_plugins = require('./common_plugins'),
    passport = require('passport');

module.exports = function (app, model, route) {

    var authenticate = function (req, res, next){
        passport.authenticate('jwt', { session: false }, function(err, user, info) {
            if (err) { return next(err); }
            if (!user) {
                res.status(401);
                return res.send({token: null, error: info.message});
            }
            next();
        })(req, res, next);
    };

    model.methods(['get', 'post', 'put', 'delete']);
    model.schema.plugin(common_plugins);

    if(model.schema.options.authenticate){
        model.before('get', authenticate);
        model.before('put', authenticate);
        model.before('post', authenticate);
        model.before('delete', authenticate);
    }

    model.register(app, route);
}
