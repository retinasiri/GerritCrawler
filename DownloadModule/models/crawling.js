var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CrawlingSchema = new Schema({
    project_name: String,
    url: String,
    project: String,
    number_of_open_changes_collected: {type : Number, default: 0},
    number_of_merged_changes_collected: {type : Number, default: 0},
    number_of_abandoned_changes_collected: {type : Number, default: 0}
}, {
    versionKey: false,
    strict: false
});
Crawling = mongoose.model('Crawling', CrawlingSchema);
//Crawling.createIndexes();
module.exports = Crawling;