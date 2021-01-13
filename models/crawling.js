var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CrawlingSchema = new Schema({
    project_name: String,
    url: String,
    project_collected:[],
    number_of_changes_collected: [],
    number_of_open_changes_collected: Number,
    number_of_merged_changes_collected: Number,
    number_of_abandoned_changes_collected: Number
}, {
    versionKey: false
});

module.exports = mongoose.model('Crawling', CrawlingSchema);