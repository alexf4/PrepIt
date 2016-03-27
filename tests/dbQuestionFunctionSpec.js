var expect = require("chai").expect;
var DBFunctions = require("../DBWork/DBFunctions.js");
var questionFunctions = require("../DBWork/questionFunctions");
var assert = require('chai').assert;

var db = require('../dbWork/db');

db.connect();


describe("DB Functions", function () {

    this.timeout(40000);


    describe("#findQuestionsForUser()", function () {

        var UserID = "5684903dab13621200fe364f";

        it("Should find all the questionf for a user", function (done) {
            questionFunctions.findQuestionsForUser(UserID, function (err, foundQuestions) {
                //console.log(foundQuestions);
                done()
            })
        })
    })


    describe("#findAnsweredQuestions()", function () {

        var UserID = "5684903dab13621200fe364f";

        it("Should find all the question of for a user that has been answered", function (done) {
            questionFunctions.findAnsweredQuestions(UserID, function (err, foundQuestions) {
                assert.equal( foundQuestions.length, 18, "The number of questions user has answered");
                done()
            })
        })

    })


});