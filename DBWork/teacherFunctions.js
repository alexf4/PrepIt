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
var studentFunctions = require("./studentFunctions");

/**
 * This method will update the token element of the teacher
 * @param inputID the teacher to updated
 * @param updatedLink the new string for the "token" element
 * @param callback the function that should be called when this has been updated.
 */
exports.updateTeacherLink = function (inputID, updatedLink, callback){
    userModel.findById(userId , function (err, user){

        user.token = newlink;

        user.save(function (err , user) {
            callback();
        })
    });
};

/**
 * This method will return the average mastery for a specific question
 * @param inputID the teachers ID
 * @param questionid the basequestionID to look up
 * @param routeCallback the callback.
 */
exports.getClassAverageMasteryForQuestion = function (inputID , questionid, routeCallback){
    var mastered = 0;

    var intermediate = 0;

    var novice = 0;

    //Find the users token
    async.waterfall([
        function(callback) {
            userModel.findById(inputID, function(err, user) {
                if (err){
                    callback(err, null);
                }
                callback(null, user);

            });
        },

        // find all students that have the same teacher token
        function( user, callback) {

            userModel.find({ classToken: user.token }, function (err, users){
                if (err){
                    callback(err, null);
                }
                callback(null, users);
            });
        }
    ], function (err, users) {

        //For each student in the teachers class, get the mastery of the question
        async.forEachOf(users , function (value, key, callback){

            studentFunctions.getMasteryOfQuestion(value._id.toString() ,questionid,  function(comp){
                //merge all the scores

                switch (comp){
                    case "mastered":
                        mastered ++;
                        break;
                    case "intermediate":
                        intermediate ++;
                        break;
                    case "novice":
                        novice ++;
                        break;
                }

                callback();
            })


        }, function(err){
            console.log("here");

            //Return the level of comp that has the most
            if (mastered > intermediate && mastered > novice){
                routeCallback (null, "mastered");
            }
            else if(intermediate >= mastered && intermediate > novice){
                routeCallback (null, "intermediate");
            }
            else {
                routeCallback ( null, "novice");
            }
        })

    });
}

/**
 * This method will return the class average master of a given category
 * @param inputID the userid
 * @param category the category to check
 */
exports.getClassAverageMasteryForCategory = function (inputID , category , routeCallback){

    var mastered = 0;

    var intermediate = 0;

    var novice = 0;

    //Find the users token
    async.waterfall([
        function(callback) {
            userModel.findById(inputID, function(err, user) {
                if (err){
                    callback(err, null);
                }
                callback(null, user);

            });
        },

        // find all students that have the same teacher token
        function( user, callback) {

            userModel.find({ classToken: user.token }, function (err, users){
                if (err){
                    callback(err, null);
                }
                callback(null, users);
            });
        }
    ], function (err, users) {

        //Count how many students the teacher has
        async.forEachOf(users , function (value, key, callback){

            studentFunctions.getMasterOfCategory(value._id.toString() ,category,  function(comp){
                //merge all the scores

                switch (comp){
                    case "mastered":
                        mastered ++;
                        break;
                    case "intermediate":
                        intermediate ++;
                        break;
                    case "novice":
                        novice ++;
                        break;
                }

                callback();
            })


        }, function(err){
            console.log("here");

            //Return the level of comp that has the most
            if (mastered > intermediate && mastered > novice){
                routeCallback (null, "mastered");
            }
            else if(intermediate >= mastered && intermediate > novice){
                routeCallback (null, "intermediate");
            }
            else {
                routeCallback ( null, "novice");
            }
        })

    });
}


/**
 * This method will get all the scores of the students that are linked to this user
 * @param inputID the teachers id
 * @param routeCallback the function that is called back when this is ready
 */
exports.getStudentsScores = function (inputID, routeCallback){


    var retDict = new Dict;

    //Find the users token
    async.waterfall([
        function(callback) {
            userModel.findById(inputID, function(err, user) {
                if (err){
                    callback(err, null);
                }
                callback(null, user);

            });
        },
        function (user, callback){
            categoryModel.find({}, function (err, categories){
                if (err){
                    callback(err, null);
                }

                //Setup dictionary
                categories.forEach(function (entry){
                    var questionData = {
                        questions : 0,
                        correct : 0,
                        testPercent : entry.TestPercent
                    }

                    retDict.set(entry.Title , questionData);
                })

                //ser the total number of questions
                retDict.set("totalQuestions" , 0);

                retDict.set("totalCorrect" , 0);

                callback(null, user);

            });
        },
        function( user, callback) {
            // find all students that have the same teacher token
            userModel.find({ classToken: user.token }, function (err, users){
                if (err){
                    callback(err, null);
                }
                callback(null, users);
            });
        }
    ], function (err, users) {

        //Count how many students the teacher has

        var numStudents = users.length;


        async.forEachOf(users , function (value, key, callback){

            studentFunctions.getUserScores(value._id.toString(), function(scores){
                //merge all the scores


                addStudentScoresToTotal(numStudents , retDict , scores);

                //scores.forEach( function (entry){
                //    console.log("here2");
                //})

                callback();


            })


        }, function(err){
            console.log("here");

            //return the scores with callback(scores);
            routeCallback(retDict);
        })

    });

}

/**
 * This method will compile the students data into one source
 * @param numStudents the total number of students
 * @param totalScores the total scores dictionary
 * @param studentScore the new student score to be added
 */
function addStudentScoresToTotal ( numStudents, totalScores, studentScore){

    //Create an array of each key
    keys = totalScores.keys();

    tempValue = null;

    //get values for each key
    keys.forEach(function (entry){
        if (entry == "totalCorrect") {
            tempValue = studentScore.get("totalCorrect") / numStudents;

            tempValue = tempValue + totalScores.get(entry);


            //  totalScores.set(entry , tempValue);

        }else if (entry == "totalQuestions"){
            tempValue = studentScore.get("totalQuestions") / numStudents;

            tempValue = tempValue + totalScores.get(entry);

            // totalScores.set(entry , tempValue);

        }else{
            console.log("last");

            var sectionScore = studentScore.get(entry);
            var runningTotalScore = totalScores.get(entry);

            tempValue = {
                questions : (sectionScore.questions / numStudents) + runningTotalScore.questions,
                correct : (sectionScore.correct /numStudents) + runningTotalScore.correct,
                testPercent : (sectionScore.testPercent /numStudents) + runningTotalScore.testPercent
            }

        }

        totalScores.set(entry , tempValue);

    })

}

/**
 * This method will count all the students in a class
 * @param teacherToken the class
 */
function numberOfStudentsInClass (teacherToken){
    // find all students that have the same teacher token
    userModel.find({ classToken: user.token }, function (err, users){
        if (err){
            callback(err, null);
        }


        callback(null, users.length);
    });
}



