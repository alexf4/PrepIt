var questionModel = require("../models/question");
var list = require("collections/list");


/**
 * This function will return all the questions of a user
 * @param inputID
 * @param callback
 */
exports.findQuestionsForUser = function (inputID, callback) {

    questionModel.find({userID: inputID}, function (err, foundQuestions) {
            if (err) {
                callback(err, null);
            }

            callback(null, foundQuestions);
        }
    )

};

exports.findQuestionsForUserInCategory = function (inputID, category, callback){
    questionModel.find({userID: inputID , category : category}, function (err, foundQuestions){
        if (err) {
            callback(err, null);
        }

        callback(null, foundQuestions);
    })
}

/**
 * This method finds all questions that have been answered
 * @param inputID
 * @param callback
 */
exports.findAnsweredQuestions = function (inputID, callback) {

    var answeredQuestions = new list();

    questionModel.find({userID: inputID}, function (err, foundQuestions) {
        if (err) {
            callback(err, null);
        }

        foundQuestions.forEach(function (entry) {
            if (entry.numberOfAttempts > 0) {

                answeredQuestions.add(entry);


            }
        });


        callback(null, answeredQuestions);
    })

};