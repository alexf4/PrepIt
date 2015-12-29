var expect = require("chai").expect;
var teacherFunctions = require("../dbWork/teacherFunctions.js");
var assert = require('chai').assert

describe("Teacher Functions", function(){

    describe("#getClassAverageMasteryForQuestion()", function (){
        it("will return the average mastery for a specific question", function(){

            var teacherID = "565e939e192d1c4a09aa8769";
            var questionBaseID = "55ac191ba49be01400db533f";

            console.log("gothere1");

            teacherFunctions.getClassAverageMasteryForQuestion(teacherID, questionBaseID, function(err, scores){


                console.log("gothere2");

                assert.equal(scores, "mastered", "Should be Novice.");
            })


        })

    })

    describe("#getClassAverageMasteryForCategory()", function (){
        it("should work", function(){
            assert.equal("test", "test", "temptest");
        })

    })
    describe("#numberOfStudentsInClass()", function (){
        it("should work", function(){
            assert.equal("test", "test", "temptest");
        })

    })

})