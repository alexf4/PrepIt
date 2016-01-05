/**
 * Created by alexf4 on 6/9/15.
 */

var teacherFunctions = require("../DBWork/teacherFunctions");

var dataToChartHelper = require("../views/dataToChartHelper");

var async = require('async');

/**
 *
 * @param req
 * @param res
 */
exports.teacherPage = function(req, res ){

  //Get the users logged in id
  userId = req.session.passport.user;

  chartData = null;

  studentsList = null;

  questionList = null;


  //https://github.com/caolan/async#waterfall

  async.waterfall([
    function(callback) {
      //Get the teachers students scores/masteries
      teacherFunctions.getStudentsMasterys(userId, function(scores){
        callback(null, scores)
      })
    },
    function(scores, callback) {
      //Convert the scores into a format the front end can consume
      chartData = dataToChartHelper.createStudentMasteryChart(scores);
      callback(null)
    },
    function(callback){

      //find the teachers class token
      teacherFunctions.getTeacherClassToken(userId, function(err, classToken) {
        callback(null, classToken)
      })
    },
    function(classToken, callback) {

      //create the list of the students in the class
      teacherFunctions.listStudents(classToken, function(students){
        studentsList =  students;
        callback(null)
      })
    },
    function(callback) {

      //create the list of missed questions
      teacherFunctions.getMissedQuestionsList(userId, function(err, questions){
        questionList = questions;
        callback(null);
      })
    }
  ],  function () {
    //Send all the data to the front end.
    res.render("teacher", {totalData : chartData.totalData , totalOptions : chartData.totalOptions ,
      CUData : chartData.Constitutional_Underpinnings_Data, SectionOptions : chartData.sectionOptions,
      Civil_Rights_and_Liberties_Data : chartData.Civil_Rights_and_Liberties_Data,
      Political_Beliefs_and_Behaviors_Data : chartData.Political_Beliefs_and_Behaviors_Data,
      Linkage_Institutions_Data: chartData.Linkage_Institutions_Data,
      Institutions_of_National_Government_Data : chartData.Institutions_of_National_Government_Data,
      Public_Policy_Data : chartData.Public_Policy_Data, students : studentsList, questions : questionList
    });
  });
  
};

