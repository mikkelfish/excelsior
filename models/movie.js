var restful = require('node-restful'),
    mongoose = restful.mongoose;

var Movie = restful.model('Movie', mongoose.Schema({
            title: { type: String, searchable: true},
            year: 'number'
    },{authenticate:true, name:'Movie'}));

module.exports = Movie;