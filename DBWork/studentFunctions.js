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
 * This method removes the student teacher link and sets it to 0
 * @param inputID the students input id
 * @param callback the method to be called when its done.
 */
exports.removeStudentLink = function (inputID , callback){
    userModel.findById(inputID, function (err, user){
        if(err){
            callback(err, null);
        }

        user.classToken = 0;

        user.save(function (err, user){
            callback();
        })
    })
}

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
exports.getTeacherQuestion = function (classToken, inputBaseQuestionID, callback) {
    userModel.find({ token :classToken }, function (err, teacher){
        if (err){
            callback(err, null);
        }

        teacher[0].questions.forEach(function(entry){
            if (entry.baseQuestionID == inputBaseQuestionID) {
                callback(null, entry._id.toString());
            }
        });
    });
};

/**
 * This method will return the mastery level of category for a student.
 * @param inputID the student id
 * @param category the category to search on
 * @param callback the method called back.
 */
exports.getMasterOfCategory = function (inputID, category , callback){
    userModel.findById(inputID , function (err, user){
        if (err){
            callback(err, null);
        }

        var mastered = 0;

        var intermediate = 0;

        var novice = 0;

        //Find all the questions from a specific category
        user.questions.forEach(function(entry){

            //For each question tally its comp score
            if (entry.category == category){
                if(entry.comprehension.mastered){
                    mastered ++;
                }
                else if (entry.comprehension.intermediate){
                    intermediate ++;
                }
                else {
                    novice ++;
                }
            }
        })

        //Return the level of comp that has the most
        if (mastered > intermediate && mastered > novice){
            callback (null, "mastered");
        }
        else if(intermediate >= mastered && intermediate > novice){
            callback (null, "intermediate");
        }
        else {
            callback ( null, "novice");
        }


    });
}

/**
 * This method will return the mastery of a single question
 * @param inputID the users ID
 * @param questionID the base question ID
 * @param Callback the method to be called when its done.
 */
exports.getMasteryOfQuestion = function (inputID, questionID, callback){
    userModel.findById(inputID , function (err, user){
        if (err){
            callback(err, null);
        }

        //Find all the questions from a specific category
        user.questions.forEach(function(entry){

            //Find the question based on the input question id.
            if (entry.baseQuestionID == questionID){
                if(entry.comprehension.mastered){
                    callback (null, "mastered");
                }
                else if (entry.comprehension.intermediate){
                    callback (null, "intermediate");
                }
                else {
                    callback ( null, "novice");
                }
            }
        })

    });
}