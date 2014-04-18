var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('./user'),
    restful = require('node-restful');

//function makeMinValidator(minLength){
//    function minLength (val) {
//        return val.length >= minLength;
//    }
//    return [{validator: minLength, msg: "There must be at least " + minLength + " entries" }];
//}

module.exports = restful.model('Company',new Schema({
    name:{type: String, required: true},
    number: {type: String, required: true},
    street: {type: String, required: true},
    city: {type: String, required: true},
    region: {type: String, required: true},
    postCode: {type: String, required: true},
    country: {type: String, required: true},
    contactNumber:{type: String, required: true},
    signupDate: { type: Date, default: Date.now },
    principals: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}));
