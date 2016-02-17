/**
 * Created by alexf4 on 6/9/15.
 */

var teacherFunctions = require("../DBWork/teacherFunctions");

var dataToChartHelper = require("../views/dataToChartHelper");

var studentFunctions = require("../DBWork/studentFunctions");

var DBFunctions = require("../DBWork/DBFunctions.js");

var teacher = require("./teacher.js");

var async = require('async');

var category;
var studentEmail;
var questionText;
var classToken;

exports.setCategory=function(category){
  this.category=category;
};

exports.setStudent = function(studentEmail){
  this.studentEmail = studentEmail;
};

exports.setQuestionText = function(questionText){
  this.questionText = questionText;
};

exports.emptyOutSessionData = function(req){
  req.session.category = null;
  req.session.studentEmail = null;
  req.session.questionText = null;
};



exports.teacherDrillDown = function (req , res){

  //figure out what session data there is

  //if student, load student page
  if (req.session.studentEmail){
    //Render the student version of a view for the teacher
    teacher.renderStudentView(req, res);
  }

  //if category, load only category data
  else if (req.session.category){
    //Render the views with a specific category
    teacher.renderCategoryView(req, res);

  }
  //if question, load only question data
  else if(req.session.questionText){
    //render the views with a specific question
    teacher.renderQuestionView(req, res);
  }
  else{
    //render standard view

    teacher.teacherPage(req,res);
  }

  //empty out session data
  //TODO: may have to update the class vars.

  //I want to keep session data so if user calls refresh it still works
  //teacher.emptyOutSessionData(req);

};

exports.renderStudentView = function (req, res){
  //Find the users ID from their email

  studentFunctions.getStudentFromEmail(req.session.studentEmail, function(err, studentID){
    studentFunctions.getMasteryScores(studentID, function(scores){
      var chartData = dataToChartHelper.createStudentMasteryChart(scores);

      //TODO: Make this dynamic. We have a list of categories, but we need to clean up the names we use here
      //TODO: Cody can now render pass into the student page the side bar information on the categories.
      res.render("teacherStudentView",
          {
            //TODO: need to figure out what the total data will look like
            totalData: chartData.totalData,
            totalOptions: chartData.totalOptions,
            CUData: chartData.Constitutional_Underpinnings_Data,
            SectionOptions: chartData.sectionOptions,
            Civil_Rights_and_Liberties_Data: chartData.Civil_Rights_and_Liberties_Data,
            Political_Beliefs_and_Behaviors_Data: chartData.Political_Beliefs_and_Behaviors_Data,
            Linkage_Institutions_Data: chartData.Linkage_Institutions_Data,
            Institutions_of_National_Government_Data: chartData.Institutions_of_National_Government_Data,
            Public_Policy_Data: chartData.Public_Policy_Data,
            Title: "Student Dashboard View",
            activeSection: "Main View",
            ClassCode: this.classToken,
            studentEmail: req.session.studentEmail
          });

    })
  });



  //TODO: CODY (Drilldown) make sure we keep the side bar the teacher version
};

exports.renderCategoryView = function (req, res){

  //Render the teacher dashboard, but only focus on the category

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

      //create the list of the students in the class and provide the mastery of the category
      teacherFunctions.listStudentsAndCategoryMastery(classToken, req.session.category , function(err, students){
        studentsList =  students;
        callback(null)
      })
    },
    function(callback) {

      //create the list of missed questions
      teacherFunctions.getMissedQuestionsListPerCategory(userId, req.session.category , function(err, questions){
        questionList = questions;
        callback(null);
      })
    }
  ],  function () {
    //Send all the data to the front end.

    //TODO:CODY (Drilldown) you will need to switch up the main chart with the category that has been selected
    res.render("teacher", {
      totalData : chartData.totalData ,
      totalOptions : chartData.totalOptions ,
      CUData : chartData.Constitutional_Underpinnings_Data,
      SectionOptions : chartData.sectionOptions,
      Civil_Rights_and_Liberties_Data : chartData.Civil_Rights_and_Liberties_Data,
      Political_Beliefs_and_Behaviors_Data : chartData.Political_Beliefs_and_Behaviors_Data,
      Linkage_Institutions_Data: chartData.Linkage_Institutions_Data,
      Institutions_of_National_Government_Data : chartData.Institutions_of_National_Government_Data,
      Public_Policy_Data : chartData.Public_Policy_Data,
      students : studentsList,
      questions : questionList,
      Title: "Teacher Dashboard",
      ClassCode: this.classToken,
      Category: req.session.category
    });
  });
};

exports.renderQuestionView = function(req, res){

  //Render the question page

  DBFunctions.getQuestionData(req.sesstion.passport.user, req.session.questionText, function(err, questionData){

    //TODO:Cody (DrillDown) once you make the view for question data, take and process the questionData

    //res.render("QuestionView" , {questionData:questionData});

  })

};

/**
 * This method handles the question Analysis routing.
 * @param req
 * @param res
 */
exports.renderQuestionAnalysis = function(req, res){

  //Get the users logged in id
  userId = req.session.passport.user;

  //Grab all the missed questions associated from the teacher. This is meta data from all of their students.
  teacherFunctions.getMissedQuestionsList(userId, function(err, questions){
    if(err){
      teacher.renderNewTeacher(req, res);
    }

    res.render("questionAnalysis", {questions : questions , ClassCode: this.classToken})
  })
};


/**
 *
 * @param req
 * @param res
 */
exports.teacherPage = function(req, res ){
  //redundent
  teacher.emptyOutSessionData(req);

  //Get the users logged in id
  userId = req.session.passport.user;

  DBFunctions.isNewUser(userId, function(err, userStatus){
    if(userStatus){
      //render new user page
      //teacher.renderNewTeacher(req, res);
      teacher.renderTeacherDashboard(req, res);
    }
    else {
      //render teacher page
      teacher.renderTeacherDashboard(req, res);
    }
  });

  /**
   * This method is used to show a new teacher the help diagram
   * @param req
   * @param res
   */
  exports.renderNewTeacher = function(req, res){

    //TODO: Cody to create a new jade view that holds the jpg. The side nave header and footer should be the same
    //res.render();

  };


  /**
   * This method is used to show a teacher their dashboard.
   * @param req
   * @param res
   */
  exports.renderTeacherDashboard = function(req, res){
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
          this.classToken = classToken;
          callback(null, classToken)
        })
      },
      function(classToken, callback) {

        //create the list of the students in the class
        teacherFunctions.listStudents(classToken, function(err, students){
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
      res.render("teacher",
          {
            totalData : chartData.totalData,
            totalOptions : chartData.totalOptions,
            CUData : chartData.Constitutional_Underpinnings_Data,
            SectionOptions : chartData.sectionOptions,
            Civil_Rights_and_Liberties_Data : chartData.Civil_Rights_and_Liberties_Data,
            Political_Beliefs_and_Behaviors_Data : chartData.Political_Beliefs_and_Behaviors_Data,
            Linkage_Institutions_Data: chartData.Linkage_Institutions_Data,
            Institutions_of_National_Government_Data : chartData.Institutions_of_National_Government_Data,
            Public_Policy_Data : chartData.Public_Policy_Data,
            students : studentsList,
            questions : questionList,
            Title: "Teacher Dashboard",
            ClassCode: this.classToken,
            Category: req.session.category
      });
    });
  }


  
};

