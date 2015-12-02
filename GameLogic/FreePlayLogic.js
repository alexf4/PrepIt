/**
 * Created by beckyedithbrooker on 7/18/15.
 */

var userModel = require("../models/user");
var studentFunctions = require("../DBWork/studentFunctions");
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

        //TODO: Clean up this save code
        var questions = user.questions;

        //Find a question that has an incorrect
        //foundQuestion = findNextQuestion(user.questions);

        //find the question in the user item
        user.questions.forEach(function (entry) {


            /**
             * adding new questions.
             */

            if (entry._id.toString() == questionID) {

                //Update the teachers question with metric data
                if (!user.isteacher && user.classToken != 0){
                    updateTeacherData( user.classToken, entry.baseQuestionID, userAnswer);
                }


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

/**
 * This method will update the teachers question set with information from the student
 * @param inputClassToken the class token is used to find the teacher
 * @param inputBaseQuestionID the base question id links the student and teacher questions together.
 * @param userAnswer what the student entered
 */
function updateTeacherData (inputClassToken, inputBaseQuestionID , userAnswer){
    //get the Teacher
    studentFunctions.getTeacher(inputClassToken, function(err, teacher){
        // Get the teachers question
        studentFunctions.getTeacherQuestion(inputClassToken , inputBaseQuestionID,  function(err , questionID){
            if(err){
                console.log(err.toString());
            }

            //The the check anser method from the teacher object to update it
            FreePlayLogic.checkAnswer(teacher[0]._id , userAnswer , questionID , function (result){
                console.log("Question data added to teacher object");
            })
        } )
    });
}