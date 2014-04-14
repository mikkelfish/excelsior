var Movie = require('./models/movie'),
    common_plugins = require('./common_plugins'),
    solr = require('solr-client'),
    _ = require('underscore'),
    http = require('http'),
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
    var options = {};
    model.schema.plugin(common_plugins);
    if(model.schema.options.hasSearch){
        var client = solr.createClient();

//        client.delete('id','*',function(err,obj){
//            if(err){
//                console.log(err);
//            }else{
//                console.log(obj);
//            }
//        });

        model.route('query.get', function(req, res, next) {
            var qDoc = {};
            _.forEach(model.schema.options.searchable, function(q){
                if(q in req.query) {
                    qDoc[q + "_t"] = req.query[q];
                }
            });

            if(!req.query.anyType){
                qDoc['type_t'] = model.schema.options.name;
            }

            var start = req.query.start || 0;
            var rows = req.query.limit || 100;
            var query = client.createQuery()
                .q(qDoc)
                .start(start)
                .rows(rows);
            client.search(query,function(err,obj){
                if(err){
                    next(err);
                }else{
                    var results = [];
                    var finalize = _.after(obj.response.docs.length, function(){
                        res.send({results:results});
                    });
                    _.each(obj.response.docs, function(doc){
                       model.findOne({"_id" : doc.id}, function(err, m){
                           if(err){
                               next(err);
                           } else {
                               results.push(m);
                               finalize();
                           }
                       });
                    });
                }
            });
        });
    }

    if(model.schema.options.authenticate){
        model.before('get', authenticate);
        model.before('put', authenticate);
        model.before('post', authenticate);
        model.before('delete', authenticate);
    }

    model.register(app, route);
}
