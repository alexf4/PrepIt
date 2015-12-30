var expect = require("chai").expect;
var studentFunctions = require("../dbWork/studentFunctions.js");
var assert = require('chai').assert;

var db = require('../dbWork/db');

db.connect();
describe ("Student Functions", function(){
    describe("#getMasterOfCategory()", function (){

        var studentID = "56843ba3a2d4c2e80cb75c62";
        var category = "Linkage Institutions";

        it("should return the mastery level of category for a student", function(done){
            studentFunctions.getMasterOfCategory(studentID, category, function(err, scores){
                assert.equal(scores , "novice", "should be novice");
                done();
            })
        })
    });

    describe("#getMasteryOfQuestion()", function (){

        var studentID = "56843ba3a2d4c2e80cb75c62";
        var questionBaseID = "55ac17c9a49be01400db5339";

        it("should return the mastery of a single question", function(done){

            studentFunctions.getMasteryOfQuestion(studentID , questionBaseID, function (err, scores){
                assert.equal(scores, "novice", "should be novice");
                done();
            })
        })
    });
});