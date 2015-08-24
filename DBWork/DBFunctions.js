/**
 * Created by beckyedithbrooker on 7/18/15.
 */
var questionModel = require("../models/question");
var categoryModel = require("../models/category");
var category = require("../models/category");
var userModel = require("../models/user");
var mongoose = require('mongoose');
var async = require('async');
var Dict = require("collections/dict");

/**
 * This method will add a new question to all users question sets
 */
exports.addQuestionToAllUsers = function (inputID){


    var foundQuestion = null;

    //Get the question via question id
    questionModel.findById(inputID, function(err, question) {
        if (err) throw err;

        // show the one user
        console.log(question);


        //save the question
        foundQuestion = question;


        //Get a list of all users
        // get all the users
        userModel.find({}, function(err, users) {
            if (err) throw err;

            // object of all the users
            console.log(users);

            //For each user add a new question that is a copy of the question, but has a new id
            users.forEach(function(user) {

                //Create new question
                var userQuestion = new questionModel(foundQuestion);
                userQuestion._id = mongoose.Types.ObjectId().toString();


                //Add that question to that users question set
                user.questions.push(userQuestion);

                user.save(function(error, data){});

            });

        });


    });


};


exports.addQuestionsToUser = function (inputID, callback){

    foundUser = null;

    //Find the new user
    userModel.findById(inputID, function(err, user) {

        if (err) throw err;

        foundUser = user;


        //Find all of the questions in the question set
        questionModel.find({}, function(err, questionsList){

            //For each question create a clone and add it to the users set
            questionsList.forEach(function (question){
                newQuestion = new questionModel(question);
                newQuestion._id = mongoose.Types.ObjectId().toString();

                foundUser.questions.push(newQuestion);

            });

            foundUser.save(function(error, data){

                newQuestion = null;


                callback(null);
            });
        });





    });


}

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
        //TODO make this into a function
        function(err, results){

            //Find how many questions there are
            foundUser = results[0];
            categories = results[1];


            categories.forEach(function(entry){
                var numberOfQuestionsPerCategory = countNumberOfQuestionsPerCategory(entry.Title, foundUser.questions);
                var numberOfQuestionsCorrectPerCategory = countNumberOfQuestionsCorrectPerCategory(entry.Title , foundUser.questions)

                var questionData = {
                    questions : numberOfQuestionsPerCategory,
                    correct : numberOfQuestionsCorrectPerCategory,
                    testPercent : entry.TestPercent
                }

                retDict.set(entry.Title , questionData);

            })

            //Add the total number of questions
            var totalQuestions = foundUser.questions.length;

            retDict.set("totalQuestions" , totalQuestions);


            var totalCorrectQuestions = numberOfCorrectAnswersForUser(foundUser.questions);

            retDict.set("totalCorrect" , totalCorrectQuestions);

            callback(retDict);

        });
}

exports.getStudentsScores = function (inputID, test, routeCallback){


    var retDict = new Dict;

    //TODO need to dynamiclly populate the dict add another step in the waterfall

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
            userModel.find({ teacherToken: user.token }, function (err, users){
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

            test.getUserScores(value._id.toString(), function(scores){
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



//TODO Move these to user models
function countNumberOfQuestionsPerCategory(inputCategory , questionSet){

    var numberOfQuestions = 0;

    questionSet.forEach(function (entry){
        if (entry.category == inputCategory){
            numberOfQuestions ++;
        }
    });

    return numberOfQuestions;

}

function countNumberOfQuestionsCorrectPerCategory(inputCategory , questionSet){

    var numberOfQuestionsCorrect = 0;


    questionSet.forEach(function (entry){
        if ((entry.category == inputCategory) && (entry.correct == true)) {
            numberOfQuestionsCorrect ++;
        }
    });


    return numberOfQuestionsCorrect;

}

function numberOfCorrectAnswersForUser(questionSet){

    var numberOfQuestionsRight = 0;

    questionSet.forEach(function(entry) {
        if (entry.correct == true){
            numberOfQuestionsRight ++;
        }
    });

    return numberOfQuestionsRight;
}

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

            //totalScores.set(entry , tempValue);

        }

        totalScores.set(entry , tempValue);



    })

}


