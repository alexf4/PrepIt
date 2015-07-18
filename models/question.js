/**
 * Created by alexf4 on 7/12/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({

    category:String,
    //Change to [{ type : ObjectId, ref: 'category' }]
    subcategory: String,
    //[{ type : ObjectId, ref: 'subcategory' }]
    questionText: String,
    solution: String,
    percentRight: Number,
    answers: {a : String, b: String, c: String, d:String},
    correct: Boolean

});

// the schema is useless so far
// we need to create a model using it
var Question = mongoose.model('Question', questionSchema);

// make this available to our users in our Node applications
module.exports = Question;
