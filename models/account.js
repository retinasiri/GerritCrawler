var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
    _account_id: Number,
    name: String,
    email: String,
    username: String,
    number_of_changes: Number
    //display_name: String
}, {
    versionKey: false
});

module.exports = mongoose.model('Account', AccountSchema);