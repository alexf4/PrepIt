var expect = require("chai").expect;
var DBFunctions = require("../DBWork/DBFunctions.js");
var questionFunctions = require("../DBWork/questionFunctions");
var assert = require('chai').assert;

var db = require('../DBWork/db');

db.connect();



describe ("DB Functions" , function (){

    this.timeout(40000);

    describe ("#getNumberOfQuestionsPerCategory()", function (){
        it("should return the number of questions in the db of a specific category" , function(done){

            var category = "Constitutional Underpinnings";

            DBFunctions.getNumberOfQuestionsPerCategory(category, function(err, questionCount){
                assert.equal( questionCount, 50, "The number of questions in a category");
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


    describe ("#checkClass()", function(){
        var classToken = "74fb18a";

        it("should return that the class exists", function(done){

            DBFunctions.checkClass(classToken, function(err, found){

                assert.equal(true, found, "The class was found");

                //console.log(questionData);
                done();
            })
        })

        var invalidClassToken = "zzzzzzz";

        it("should return that the class does not exists", function(done){

            DBFunctions.checkClass(invalidClassToken, function(err, found){

                assert.equal(false, found, "The class was found");

                //console.log(questionData);
                done();
            })
        })

    });

    describe("#isNewUser()", function(){

        var teacherWithStudents = "5684903dab13621200fe364f";
        var teacherWithoutStudents = "56b7936de16c78b903572ea8";
        var studentThatHasAnsweredQuestions = "56843ba3a2d4c2e80cb75c62";
        var studentThatHasNotAnsweredQuestions = "56b7937ce16c78b903572eec";



        //it("should return false if the user has  answered any questions", function(done){
        //    DBFunctions.isNewUser(studentThatHasAnsweredQuestions, function(err, userStatus){
        //        assert.equal(userStatus, false, "There should have questions answered");
        //        done();
        //    })
        //});

        it("should return false if the user is a teacher and has students", function(done){
            DBFunctions.isNewUser(teacherWithStudents, function(err, userStatus){
                assert.equal(userStatus, false, "There should have students");
                done();
            })
        });

        it("should return true if the user has not answered any questions", function(done){
            DBFunctions.isNewUser(studentThatHasNotAnsweredQuestions, function(err, userStatus){
                assert.equal(userStatus, true, "There should have no questions answered");
                done();
            })
        });

        it("should return true if the user is a teacher does not have any students.", function (done) {
            DBFunctions.isNewUser(teacherWithoutStudents, function(err, userStatus){
                assert.equal(userStatus, true, "There should have no students");
                done();
            })
        });


    })


    //describe.only ("#adminPasswordReset()", function (){
    //    it("reset the users password" , function(done){
    //
    //
    //        var userID = "56f87d3581f8f10c00ae9e46";
    //
    //        var tempPassword = "election";
    //
    //        DBFunctions.adminPasswordReset(userID, tempPassword , function(err, saveduser){
    //
    //
    //
    //
    //            done();
    //        })
    //
    //    })
    //});



    //describe("#updateteacherQuestionSet()", function(){
    //
    //    var classToken = "33625fa";
    //    //get all the students from the teacher object
    //    it("it should work", function(done){
    //        DBFunctions.updateTeachersQuestions(classToken, function(){
    //            done()
    //        })
    //    })
    //
    //
    //})

    //describe("#generateQuestionsForUser()", function(){
    //    it ("should populate the question database with the content of the users question set", function (done){
    //        DBFunctions.generateQuestionsForUsers(function(err){
    //            done();
    //        })
    //    })
    //})

});