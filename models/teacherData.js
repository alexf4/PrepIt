/**
 * Created by alexf4 on 7/12/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teacherDataSchema = new Schema({

    userId : String,

    chartData : String,
    studentsList: String,
    questionList : String
});


// we need to create a model using it
var TeacherData = mongoose.model('TeacherData', teacherDataSchema);

// make this available to our users in our Node applications
module.exports = TeacherData;
