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
        schema.post('save', function (result){
            var toindex = {type_t: schema.options.name};

            _.each(filters, function(f){
                toindex[f + '_t'] = result._doc[f];
            });

            toindex["id"] = result._doc._id.toString();

            client.add(toindex,function(err,obj){
                if(err){
                    console.log(err);
                }else{
                    console.log(obj);
                }
            });
        });

        schema.post('remove', function (result) {
            client.deleteByID(result._doc._id.toString(),function(err,obj){
                if(err){
                    console.log(err);
                }else{
                    console.log(obj);
                }
            });
        });

        schema.options.hasSearch = true;
        schema.options.searchable = ['type'].concat(filters);
    }
}
