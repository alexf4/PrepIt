var expect = require("chai").expect;
var DBFunctions = require("../DBWork/DBFunctions.js");
var assert = require('chai').assert;

var db = require('../dbWork/db');

db.connect();



describe ("DB Functions" , function (){

    describe ("#getNumberOfQuestionsPerCategory()", function (){
        it("should return the number of questions in the db of a specific category" , function(done){

            var category = "Constitutional Underpinnings";

            DBFunctions.getNumberOfQuestionsPerCategory(category, function(err, questionCount){
                assert.equal( questionCount, 33, "The number of questions in a category");
                done();
            })

        })
    });

    describe ("#getQuestionData()", function(){
        var userID = "5684903dab13621200fe364f";
        var questionText = "Iron triangles ensure that interest groups...";

        it("should return the users question data given an user id and a question title", function(done){

            DBFunctions.getQuestionData(userID, questionText, function(err, questionData){
                //console.log(questionData);
                done();
            })
        })
    });

});