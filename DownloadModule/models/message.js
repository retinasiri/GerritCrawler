var mongoose = require('mongoose');
var Account = require('./account').schema;
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    id: String,
    author: {type: Account},
    real_author: {type: Account},
    date: String,
    message: String,
    _revision_number: Number,
    change_id: String,
    _number: Number
}, {
    versionKey: false
});

module.exports = mongoose.model('Message', MessageSchema);