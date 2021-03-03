var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MetricsSchema = new Schema({
    id: Number,
    titleLength:Number,
    descriptionLength: Number,
    NumberOfFiles: Number,
    NumberOfFilesPerType:{},
    authorId: Number,
    reviewerID:{},
    timeOfTheReview: Number

}, {
    versionKey: false
});

const Account = mongoose.model('Account', MetricsSchema)
//Account.createIndexes();

module.exports = Account;