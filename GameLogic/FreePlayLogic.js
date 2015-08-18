/**
 * Created by beckyedithbrooker on 7/18/15.
 */
var DBFunctions = require("../DBWork/DBFunctions");
var userModel = require("../models/user");
var mongoose = require('mongoose');
var async = require('async');
var Dict = require("collections/dict");

exports.getQuestion = function(inputID , callback) {

    var retDict = new Dict;

    var foundUser = null;


    userModel.findById(inputID, function(err, user) {
        if (err){
            callback(err, null);
        }



        //Find a question that has an inccorect
        foundQuestion = findNextQuestion(user.questions);


        console.log("here");

        callback(foundQuestion);

    });
    //grab a question that the user has not gotten right
    //Get the users logged in id
    //TODO finding the next question should live on the db object
    //TODO Optimize the search for new questions






    //Pass the question to render

};

exports.getQuestionFromCategory = function(inputID , category , callback){

};

exports.getQuestionFromSubCategory = function(inputID, subCategory ,  callback){

}


exports.checkAnswer = function(inputId, userAnswer, questionID, callback){


    //grab the questions correct answer
    userModel.findById(inputID, function(err, user) {
        if (err){
            callback(err, null);
        }

        //Find a question that has an inccorect
        foundQuestion = findNextQuestion(user.questions);

        //find the question in the user item
        user.questions.forEach(function (entry){

            if (entry._id.toString() == questionID){
                if (entry.solution == userAnswer){
                    //Mark question as correct

                    //TODO find the DB Query
                    user.update({});

                    result = {
                        correct : true,
                        question : entry
                    }

                }else{
                    result = {
                        correct : false,
                        question : entry
                    }
                }
                callback(result);
            }
        })
    });


};

function findNextQuestion(questionSet){
    //Find all the questions that have not been answered

    var possibleQuestions = [];

    var returnQuestion = null;

    questionSet.forEach(function (entry){
       if (!entry.correct){
           possibleQuestions.add(entry);
       }
    });

    //Randomly choose a question

    returnQuestion = possibleQuestions[Math.floor(Math.random()*possibleQuestions.length)];

    //TODO May want to set a time stamp on the question so it doenst pop up next



    return returnQuestion;


}