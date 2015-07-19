/**
 * Created by beckyedithbrooker on 7/18/15.
 */
var questionModel = require("../models/question");
var user = require("../models/user");
var mongoose = require('mongoose');

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
        user.find({}, function(err, users) {
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


exports.addQuestionsToUser = function (inputID){

    foundUser = null;

    //Find the new user
    user.findById(inputID, function(err, user) {

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
            });
        });





    });


}



