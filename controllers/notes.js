var Note = require("../models/Note");
var makeDate = require("../scripts/date");

module.exports = {
    //grab all notes associated
    get: function(data, cb){
        Note.find({
            _headlineId: data._id
        }, cb);
    },
    //make save function to take in user data and cb function, 
    save: function(data, cb){
        var newNote ={
            _headlineId: data._id,
            date: makeDate(),
            noteText: data.noteText
        };
        //creates new note that passes doc to cb function
        Note.create(newNote, function(err,doc){
            if (err) {
                console.log(err);
            }
            else {
                console.log(doc);
                cb(doc);
            }
        });
    },
    delete: function(data, cb) {
        Note.remove({_id: data._id}, cb);
    }
};