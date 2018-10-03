var mongoose = require('mongoose');

//create schema using mongoose schema function
var Schema = mongoose.Schema;

//create new schema, requirements
var headlineSchema = new Schema({
    headline:{
        type: String,
        required: true,
        unique: true
    },
    summary:{
        type: String,
        required: true
    },
    date: String,
    url:{
        type: String,
        required: true
    },
    saved:{
        type: Boolean,
        default: false
    }
});

// This creates the model from the above schema, using mongoose's model method
var Headline = mongoose.model('Headline', headlineSchema);

// Export the Headline model
module.exports = Headline;