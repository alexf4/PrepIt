/**
 * Created by beckyedithbrooker on 7/18/15.
 */

var userModel = require("../models/user");

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

exports.getQuestionFromCategory = function (inputID, category, callback) {

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


        var questions = user.questions;

        //Find a question that has an incorrect
        //foundQuestion = findNextQuestion(user.questions);

        //find the question in the user item
        user.questions.forEach(function (entry) {

            if (entry._id.toString() == questionID) {

                result.question = entry;

                if (entry.solution == userAnswer) {
                    //Mark question as correct
                    entry.correct = true;
                    result.correct = true;

                } else {
                    entry.correct = false;
                    result.correct = false;
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
