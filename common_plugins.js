var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    si = require('search-index'),
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

        schema.post('save', function (result){
            filters.push(schema.options.name);
            var toindex = {type: schema.options.name};
            toindex = extend(toindex, result._doc);
            delete toindex['_id'];
            var full = {};
            full[result._doc._id.toString()] = toindex;
            si.index(JSON.stringify(full), schema.options.name, filters, function(msg) {

            });
        });

        schema.post('remove', function (result) {
            si.deleteDoc(result._doc._id.toString(), function (msg) {

            });
        });
    }
}
