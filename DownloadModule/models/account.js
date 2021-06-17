var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
    _account_id: Number,
    name: String,
    email: String,
    username: String,
    number_of_changes: Number,
    status: String
    //display_name: String
}, {
    versionKey: false,
    strict: false
});

const Account = mongoose.model('Account', AccountSchema)
//Account.createIndexes();

module.exports = Account;