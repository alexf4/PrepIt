/**
 * Created by beckyedithbrooker on 7/18/15.
 */

var userModel = require("../models/user");
var studentFunctions = require("../dbWork/studentFunctions");
var FreePlayLogic = require("./FreePlayLogic");

exports.getQuestion = function (inputID, callback) {

    userModel.findById(inputID, function (err, user) {
        if (err) {
            callback(err, null);
        }

        //Find a question that has an incorrect
        var foundQuestion = user.findNextQuestion();

        callback(foundQuestion);

    });

};

/**
 * This method will return a question with a specific category
 * @param inputID the current user
 * @param category the category to choose from
 * @param callback the function ath will be called back
 */
exports.getQuestionFromCategory = function (inputID, category, callback) {

    userModel.findById(inputID, function (err, user) {
        if (err) {
            callback(err, null);
        }

        //Find a question that has an incorrect
        var foundQuestion = user.findNextQuestionFromCategory(category);

        callback(foundQuestion);

    });
};

exports.getQuestionFromSubCategory = function (inputID, subCategory, callback) {

};


exports.checkAnswer = function (inputId, userAnswer, questionID, callback) {


    var result = {
        correct: false,
        question: null
    };

    //grab the questions correct answer
    userModel.findById(inputId, function (err, user) {
        if (err) {
            callback(err, null);
        }

        //Update the teachers question with metric data
        //if (!user.isteacher && user.classToken != 0){
        //    //if this is a student, call this method from the teachers account
        //    studentFunctions.getTeacher(user.classToken, function(err, teacher){
        //        //
        //
        //        studentFunctions.getTeacherQuestion(user.classToken , )
        //
        //        FreePlayLogic.checkAnswer(teacher[0]._id , userAnswer , questionID , function (result){
        //            console.log("Question data added to teacher object");
        //        })
        //    });
        //}

        //TODO: Clean up this save code
        var questions = user.questions;

        //Find a question that has an incorrect
        //foundQuestion = findNextQuestion(user.questions);

        //find the question in the user item
        user.questions.forEach(function (entry) {


            /**
             * TODO Teachers have different question id then the one being passed in. Need to update the DBfunction for
             * adding new questions.
             */

            if (entry._id.toString() == questionID) {

                result.question = entry;

                //update the count of the users answer
                switch (userAnswer) {
                    case "a":
                        entry.responses.a ++;

                        break;
                    case "b":
                        entry.responses.b ++;

                        break;
                    case "c":
                        entry.responses.c ++;

                        break;
                    case "d":
                        entry.responses.d ++;

                        break;
                }

                entry.numberOfAttempts ++;


                if (entry.solution == userAnswer) {
                    //Mark question as correct
                    entry.correct = true;
                    result.correct = true;

                    entry.correctAttempts ++;


                } else {
                    entry.correct = false;
                    result.correct = false;

                    entry.incorrectAttempts ++;

                }

            }
        });

        user.questions = null;

        user.save(function (err, product, number) {

            user.questions = questions;

            user.save(function (err, product, number) {
                callback(result);
            })
        })
    });


};


//function updateTeacherData (){
//
//}