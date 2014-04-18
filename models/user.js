var mongoose = require('mongoose'),
    Account = require('passport-mongoose-jwt').AccountPlugin,
    Schema = mongoose.Schema,
    util = require('util')
    extend = require('util')._extend;

//TODO address lookup?
var User = new Schema({
    fullname:{type: String, required: true},
    number: {type: String, required: true},
    street: {type: String, required: true},
    city: {type: String, required: true},
    region: {type: String, required: true},
    postCode: {type: String, required: true},
    country: {type: String, required: true},
    contactNumber:{type: String, required: true},
    signupDate: { type: Date, default: Date.now }
});

User.plugin(Account);
module.exports = mongoose.model('User', User);
