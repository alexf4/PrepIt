/**
 * Created by beckyedithbrooker on 7/18/15.
 */

var userModel = require("../models/user");
var studentFunctions = require("../DBWork/studentFunctions");
var FreePlayLogic = require("./FreePlayLogic");

var DBFunctions = require("../DBWork/DBFunctions.js");
var questionFunctions = require("../DBWork/questionFunctions.js");

exports.getQuestion = function (inputID, callback) {

    userModel.findById(inputID, function (err, user) {
        if (err) {
            callback(err, null);
        }

        user.findNextQuestion(function (err, foundQuestion) {
            callback(foundQuestion);
        })

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

    var foundUser;

    userModel.findById(inputId, function (err, user) {
        if (err) {
            callback(err, null);
        }

        foundUser = user;

        questionFunctions.findQuestionsForUser(inputId, function (err, questions) {
            if (err) {
                routeCallback(err, null);
            }

            questions.forEach(function (entry) {


                /**
                 * adding new questions.
                 */

                if (entry.baseQuestionID == questionID) {

                    //Update the teachers question with metric data
                    if (!foundUser.isteacher && foundUser.classToken != 0) {
                        FreePlayLogic.updateTeacherData(foundUser.classToken, entry.baseQuestionID, userAnswer);
                    }


                    result.question = entry;

                    //update the count of the users answer
                    switch (userAnswer) {
                        case "a":
                            entry.responses.a++;

                            break;
                        case "b":
                            entry.responses.b++;

                            break;
                        case "c":
                            entry.responses.c++;

                            break;
                        case "d":
                            entry.responses.d++;

                            break;
                    }

                    entry.numberOfAttempts++;


                    if (entry.solution == userAnswer) {
                        //Mark question as correct
                        entry.correct = true;
                        result.correct = true;

                        entry.correctAttempts++;


                    } else {
                        entry.correct = false;
                        result.correct = false;

                        entry.incorrectAttempts++;

                    }

                    entry.comprehension = calcComprehension(entry.numberOfAttempts, entry.correctAttempts);


                    entry.save(function (err, product, number) {
                        callback(result);
                    })
                }
            });
        })

    });



};

/**
 * This method will update the teachers question set with information from the student
 * @param inputClassToken the class token is used to find the teacher
 * @param inputBaseQuestionID the base question id links the student and teacher questions together.
 * @param userAnswer what the student entered
 */
exports.updateTeacherData = function (inputClassToken, inputBaseQuestionID, userAnswer) {
    //get the Teacher
    studentFunctions.getTeacher(inputClassToken, function (err, teacher) {
        // Get the teachers question

        if (err) {

            console.log("teacher not found");

        }
        else {
            studentFunctions.getTeacherQuestion(inputClassToken, inputBaseQuestionID, function (err, questionID) {
                if (err) {
                    console.log("Cant find it " + err.toString());
                }
                else {
                    //The the check answer method from the teacher object to update it
                    FreePlayLogic.checkAnswer(teacher[0]._id, userAnswer, questionID, function (result) {
                        console.log("Question data added to teacher object");
                    })
                }


            })
        }

    });
}

/**
 * This method will return an comprehension object
 * @param numAttempts this is the current number of attempts on this question
 * @param numCorrect this is the number correct answers of this question
 * @returns {{mastered: boolean, intermediate: boolean, novice: boolean}} a comprehension object
 */
function calcComprehension(numAttempts, numCorrect) {

    var retComprehension = {
        mastered: false,
        intermediate: false,
        novice: false
    };

    var compRatio = numCorrect / numAttempts;

    if (compRatio > .75) {
        retComprehension.mastered = true;
    }
    else if (compRatio < .75 && compRatio > .50) {
        retComprehension.intermediate = true;
    }
    else if (compRatio <= .50) {
        retComprehension.novice = true;
    }

    return retComprehension;

}