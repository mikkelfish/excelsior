var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    solr = require('solr-client'),
    _ = require("underscore"),
    extend = require('util')._extend;

module.exports = exports = function tokenPlugin (schema, options) {
    schema.set('toJSON', {
        transform: function (doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    });

    var filters = [];
    schema.eachPath(function(name, pathType){
        if(pathType.options.searchable){
            filters.push(name);
        }
    });

    if(filters.length > 0){
        var client = solr.createClient();
        client.autoCommit = true;
        schema.pre('save', function (next){
            var toindex = {type_t: schema.options.name};
            var self = this;
            _.each(filters, function(f){
                toindex[f + '_t'] = self._doc[f];
            });

            toindex["id"] = self._doc._id.toString();

            client.add(toindex,function(err,obj){
                if(err){
                    var error = new Error(err);
                    error.statusCode = 500;
                    next(error);
                }else{
                    next();
                }
            });
        });

        schema.pre('remove', function (next) {
            client.deleteByID(this._doc._id.toString(),function(err,obj){
                if(err){
                    next(new Error(err));
                }else{
                    next();
                }
            });
        });

        schema.options.hasSearch = true;
        schema.options.searchable = ['type'].concat(filters);
    }
}
