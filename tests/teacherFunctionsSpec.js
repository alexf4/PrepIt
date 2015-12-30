var expect = require("chai").expect;
var teacherFunctions = require("../DBWork/teacherFunctions.js");
var assert = require('chai').assert;

var db = require('../dbWork/db');

db.connect();

//TODO: need to create the test database for this stuff

describe("Teacher Functions", function(){

    describe("#getClassAverageMasteryForQuestion()", function (){
        it("will return the average mastery for a specific question", function(done){

            var teacherID = "56843bbba2d4c2e80cb75c9a";
            var questionBaseID = "55ac17c9a49be01400db5339";

            teacherFunctions.getClassAverageMasteryForQuestion(teacherID, questionBaseID, function(err, scores){

                assert.equal(scores, "novice", "Should be Novice.");
                done();
            })


        })

    });

    describe("#getClassAverageMasteryForCategory()", function (){
        it("will return the average mastery for a specific category", function(done){

            var teacherID = "56843bbba2d4c2e80cb75c9a";
            var category = "Linkage Institutions";

            teacherFunctions.getClassAverageMasteryForCategory(teacherID, category , function(err, scores){
                assert.equal(scores, "novice", "Should be novice");
                done();
            })
        })

    });
    describe("#numberOfStudentsInClass()", function (){
        it("should work", function(done){

            var classToken = "72a1ddc";
            teacherFunctions.numberOfStudentsInClass(classToken, function(err, users){
                assert.equal(1, users ,"should be one student" );
                done();
            });
        })

    })

});