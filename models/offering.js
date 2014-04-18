var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    restful = require('node-restful');

module.exports = restful.model('Offering',new Schema({
    company:{ type: Schema.Types.ObjectId, ref: 'Company', required: true },
    title: {type: String, required: true},
    pitch: {type: String, required: true},
    video_url: String,
    references: [String],
    terms: {type:String, required: true}
}));
