/**
 * Created by beckyedithbrooker on 7/18/15.
 */
var questionModel = require("../models/question");
var category = require("../models/category");
var userModel = require("../models/user");
var mongoose = require('mongoose');
var arrays = require("collections/shim-array");


/**
 * This method will add a new question to all users question sets
 */
exports.addQuestionToAllUsers = function (inputID) {


    var foundQuestion = null;

    //Get the question via question id
    questionModel.findById(inputID, function (err, question) {
        if (err) throw err;

        // show the one user
        console.log(question);


        //save the question
        foundQuestion = question;


        //Get a list of all users
        // get all the users
        userModel.find({}, function (err, users) {
            if (err) throw err;

            // object of all the users
            console.log(users);

            //For each user add a new question that is a copy of the question, but has a new id
            users.forEach(function (user) {

                //Create new question
                var userQuestion = new questionModel(foundQuestion);
                userQuestion._id = mongoose.Types.ObjectId().toString();

                //Add that question to that users question set
                user.questions.push(userQuestion);

                user.save(function (error, data) {
                });

            });

        });


    });


};


exports.addQuestionsToUser = function (inputID, callback) {

    foundUser = null;

    //Find the new user
    userModel.findById(inputID, function (err, user) {

        if (err) throw err;

        foundUser = user;


        //Find all of the questions in the question set
        questionModel.find({}, function (err, questionsList) {

            //For each question create a clone and add it to the users set
            questionsList.forEach(function (question) {
                newQuestion = new questionModel(question);
                newQuestion._id = mongoose.Types.ObjectId().toString();
                newQuestion.baseQuestionID = question._id;

                foundUser.questions.push(newQuestion);

            });

            foundUser.save(function (error, data) {

                newQuestion = null;


                callback(null);
            });
        });
    });
};

/**
 * This method will get all the question Categories
 * We had to do it this way because we cant get queires back from the category schema, those methods only
 * pertain to data in one single instace of a category.
 * @param callback The method that is called when this operation is complete.
 */
exports.getCategoryTitles = function (callback) {
    var returnArray = arrays();

    category.find({}, {'Title': 1, '_id': 0}, function (err, categories) {
        if (err) {
            callback(err, null);
        }

        categories.forEach(function (entry) {
            returnArray.push(entry.Title);
        });

        callback(null, returnArray);

    });
};

/**
 * This method will grab the n most missed questions from the users account.
 * @param inputID the users id
 * @param numberOfQuestions the number of questions to
 * @param routeCallback the call back function
 */
exports.findNMissedQuestions = function (inputID, numberOfQuestions, callback) {

    userModel.findById(inputID, function (err, user) {
        if (err) {
            callback(err, null);
        }

        //Sort the question array with our specific compare function
        user.questions.sort(compare);
        callback(null, user.questions.slice(0, numberOfQuestions - 1));
    })

};


/**
 * This method will return the top missed questions in a category
 * @param inputID the user to find
 * @param numberOfQuestions the number of questions to return
 * @param Category the category to return
 * @param callback the method that is called
 */
exports.getMissedQuestionsPerCategory = function (inputID , numberOfQuestions,  Category, callback){

    var retArray = new arrays();

    userModel.findById(userId , function (err, user){
        if(err){
            callback(err, null);
        }
        //Sort the question array with our specific compare function
        user.questions.sort(compare);

        user.questions.forEach(function (entry){
            if (entry.category == inputCategory){
                retArray.add(entry);
            }
        });

        callback(null, retArray.slice(0, numberOfQuestions -1));


    });
}

/**
 * Simple sort function. This proves that we need to move questions out of the user objects
 * @param a
 * @param b
 * @returns {number}
 */
function compare(a, b) {
    if (a.incorrectAttempts < b.incorrectAttempts)
        return -1;
    if (a.incorrectAttempts > b.incorrectAttempts)
        return 1;
    return 0;
}
/**
 * This method will return all of the questions in the db category
 * @param callback the method to be called when its done
 */
exports.getAllQuestions = function (callback) {
    questionModel.find({}, function (err, questions) {
        if (err) {
            callback(err, null);
        }
        return questions;
    });

};

/**
 * This method will return all of the questions of a user
 * @param inputID the ID of a user
 * @param callback the method to be called when its done
 */
exports.getAllQuestionsPerUser = function (inputID, callback) {
    userModel.findById(inputID, function (err, user) {
        if (err) {
            callback(err, null);
        }
        return user.questions;
    });
};
