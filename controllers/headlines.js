var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

var mongoHeadlines = require("../models/Headline");
//make Headlines controller

//all functionality for deleting and saving to export to rest of app
module.exports = {
    //grabs all articles and inserts into mongodb
    fetch: function(cb) {
        scrape(function(data){
            var articles = data;
            for (var i=0; i<articles.length; i++) {
                articles[i].date = makeDate();
                articles[i].saved = false;
            }
            //mongo function to insert articles
            mongoHeadlines.collection.insertMany(articles, {ordered:false}, function(err,docs){
                cb(err.docs);
            });
        });
    },
    delete: function(query, cb){
        mongoHeadlines.remove(query, cb);
    },
    get: function(query, cb) {
        mongoHeadlines.find(query)
        .sort({_id:-1})
        .exec(function(err, doc) {
            cb(doc);
        });
    },
    update: function(query, cb) {
        mongoHeadlines.update({_id: query._id}, {
            $set: query}, {}, cb);
    }
}