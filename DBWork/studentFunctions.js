/**
 * Created by alexf4 on 11/27/15.
 */
var questionModel = require("../models/question");
var categoryModel = require("../models/category");
var category = require("../models/category");
var userModel = require("../models/user");
var mongoose = require('mongoose');
var async = require('async');
var Dict = require("collections/dict");



/**
 * This method updates the user items teacher token slot
 * @param inputID the students id
 * @param newlink the string input that will be the set as the teacher token element
 * @param callback the function to be called after the update is done in db
 */
exports.updateStudentLink = function(inputID, newlink ,callback) {
    userModel.findById(userId , function (err, user){

        user.classToken = newlink;

        user.save(function (err , user) {
            callback();
        })
    });
};

/**
 * This method will return the scores dictionary for this student
 * @param inputID the id of the student
 * @param callback the function to be called when the data is ready.
 */
exports.getUserScores = function (inputID, callback) {

    var retDict = new Dict;

    var foundUser = null;

    async.parallel([
            function(callback){
                userModel.findById(inputID, function(err, user) {
                    if (err){
                        callback(err, null);
                    }
                    callback(null, user);

                });
            },
            function(callback){
                categoryModel.find({}, function (err, categories){
                    if (err){
                        callback(err, null);
                    }
                    callback(null, categories);

                });

            }
        ],
        // callback
        function(err, results){

            //Find how many questions there are
            foundUser = results[0];
            categories = results[1];


            categories.forEach(function(entry){

                var numberOfQuestionsPerCategory = foundUser.countNumberOfQuestionsPerCategory(entry.Title);
                var numberOfQuestionsCorrectPerCategory = foundUser.numberOfQuestionsCorrectPerCategory(entry.Title);


                var questionData = {
                    questions : numberOfQuestionsPerCategory,
                    correct : numberOfQuestionsCorrectPerCategory,
                    testPercent : entry.TestPercent
                };

                retDict.set(entry.Title , questionData);

            });

            //Add the total number of questions
            var totalQuestions = foundUser.questions.length;

            retDict.set("totalQuestions" , totalQuestions);

            var totalCorrectQuestions = foundUser.numberOfCorrectAnswersForUser();

            retDict.set("totalCorrect" , totalCorrectQuestions);

            callback(retDict);

        });
};

/**
 * This method will find the students teacher
 * @param teacherToken, the coresponding teacher token to check the tokens of all the users.
 * @param callback
 */
exports.getTeacher = function (classToken, callback) {
    userModel.find({ token :classToken }, function (err, teacher){
        if (err){
            callback(err, null);
        }
        callback(null, teacher);

    });
};

/**
 * This method will find the students teacher
 * @param teacherToken, the coresponding teacher token to check the tokens of all the users.
 * @param callback
 */
exports.getTeacherQuestion = function (classToken, questionID, callback) {
    userModel.find({ token :classToken }, function (err, teacher){
        if (err){
            callback(err, null);
        }

        teacher.questions.forEach(function(entry){
            if (entry.baseQuestionID == questionID) {
                callback(null, entry._id.toString());
            }
        });



    });
};
