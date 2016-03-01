var questionModel = require("../models/question");



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
    })

}