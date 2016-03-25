var expect = require("chai").expect;
var studentFunctions = require("../DBWork/studentFunctions.js");
var assert = require('chai').assert;

var db = require('../dbWork/db');

db.connect();
describe ("Student Functions", function(){

    this.timeout(40000);
    describe("#getMasterOfCategory()", function (){

        var studentID = "5684918fab13621200fe36bf";
        var category = "Constitutional Underpinnings";

        var expectedResults = {
            mastered : 4,
            intermediate : 0,
            novice : 90
        };

        it("should return the mastery levels of category for a student", function(done){
            studentFunctions.getMasterOfCategory(studentID, category, function(err, scores){
                assert.equal(scores.mastered, expectedResults.mastered, "mastered should be 8");
                assert.equal(scores.intermediate, expectedResults.intermediate, "intermediate should be 0");
                assert.equal(scores.novice, expectedResults.novice, "novice should be 84");
                done();
            })
        })
    });

    //describe.only("#getMasteryOfQuestion()", function (){
    //
    //    var studentID = "5684918fab13621200fe36bf";
    //    var questionBaseID = "55b13ceb89484e1300065788";
    //
    //    it("should return the mastery of a single question", function(done){
    //
    //        studentFunctions.getMasteryOfQuestion(studentID , questionBaseID, function (err, scores){
    //            assert.equal(scores, "mastered", "should be mastered");
    //            done();
    //        })
    //    })
    //});

    describe("#getUserScores()", function (){

        var studentID = "5684918fab13621200fe36bf";
        it("should return the scores for a user", function (done){
            studentFunctions.getUserScores(studentID , function(scores){
                //console.log(scores);
                done();

            })
        })
    })

    describe("#getMasteryScores()", function (){

        var studentID = "5684918fab13621200fe36bf";
        it("should return the scores for a user", function (done){
            studentFunctions.getMasteryScores(studentID , function(scores){
                //console.log(scores);
                done();

            })
        })
    });

    describe("#getStudentFromEmail()", function(){

        var studentEmail = "student3@google.com";
        var studentID = "568491a4ab13621200fe36f7";

        it("should return the studentsID from students email", function (done){
            studentFunctions.getStudentFromEmail(studentEmail, function(err, foundStudentID){

                assert.equal(foundStudentID, studentID);
                done();
            })
        })
    });

    describe("#getQuestionsForStudent()" , function(){
        var studentID = "5684918fab13621200fe36bf";

        it("should return all the questions of a student", function  (done){
            studentFunctions.getQuestionsForStudent(studentID, function(err ,questionData){
                //console.log(questionData);
                done();
            })
        })
    })
});