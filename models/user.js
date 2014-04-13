var mongoose = require('mongoose'),
    Account = require('passport-mongoose-jwt').AccountPlugin,
    Schema = mongoose.Schema,
    util = require('util')
    extend = require('util')._extend;

var User = new Schema({
    address: String,
    signupDate: Date
});

User.plugin(Account);
module.exports = mongoose.model('User', User);
