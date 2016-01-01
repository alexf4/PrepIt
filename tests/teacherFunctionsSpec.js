var expect = require("chai").expect;
var teacherFunctions = require("../DBWork/teacherFunctions.js");
var assert = require('chai').assert;

var db = require('../dbWork/db');

db.connect();

//TODO: need to create the test database for this stuff

describe("Teacher Functions", function(){

    describe("#getClassAverageMasteryForQuestion()", function (){
        it("will return the average mastery for a specific question", function(done){

            var teacherID = "5684903dab13621200fe364f";
            var questionBaseID = "55b13ceb89484e1300065788";
            var expectedResults = {
                mastered : 50,
                intermediate : 0,
                novice : 50
            }

            teacherFunctions.getClassAverageMasteryForQuestion(teacherID, questionBaseID, function(err, scores){

                assert.equal(scores.mastered, expectedResults.mastered, "mastered should be 0");
                assert.equal(scores.intermediate, expectedResults.intermediate, "intermediate should be 0");
                assert.equal(scores.novice, expectedResults.novice, "novice should be 100");
                done();
            })


        })

    });

    describe("#getClassAverageMasteryForCategory()", function (){
        it("will return the average mastery for a specific category", function(done){

            var teacherID = "5684903dab13621200fe364f";
            var category = "Constitutional Underpinnings";

            var expectedResults = {
                mastered : 6,
                intermediate : 0,
                novice : 93
            }

            teacherFunctions.getClassAverageMasteryForCategory(teacherID, category , function(err, scores){
                assert.equal(scores.mastered, expectedResults.mastered, "mastered should be 0");
                assert.equal(scores.intermediate, expectedResults.intermediate, "intermediate should be 0");
                assert.equal(scores.novice, expectedResults.novice, "novice should be 100");
                done();
            })
        })

    });
    describe("#numberOfStudentsInClass()", function (){
        it("returns the number of students in a class", function(done){

            var classToken = "74fb18a";

            teacherFunctions.numberOfStudentsInClass(classToken, function(err, users){
                assert.equal(users, 4 ,"should be one student" );
                done();
            });
        })

    })

});