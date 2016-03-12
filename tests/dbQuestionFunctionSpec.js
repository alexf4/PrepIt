var expect = require("chai").expect;
var DBFunctions = require("../DBWork/DBFunctions.js");
var questionFunctions = require("../DBWork/questionFunctions");
var assert = require('chai').assert;

var db = require('../dbWork/db');

db.connect();



describe ("DB Functions" , function (){

    this.timeout(40000);



    describe("#findQuestionsForUser()", function(){

        var UserID = "5684903dab13621200fe364f";

        it ("Should find all the questionf for a user", function (done){
            questionFunctions.findQuestionsForUser(UserID, function(err, foundQuestions){
                //console.log(foundQuestions);
             done()
            })
        })
    })



});