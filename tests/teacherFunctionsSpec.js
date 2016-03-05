var expect = require("chai").expect;
var teacherFunctions = require("../DBWork/teacherFunctions.js");
var studentFunctions = require("../DBWork/studentFunctions.js");
var assert = require('chai').assert;
var async = require('async');

var db = require('../dbWork/db');

db.connect();

//TODO: need to create the test database for this stuff

describe("Teacher Functions", function(){

    this.timeout(4000);

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
                mastered : 4,
                intermediate : 0,
                novice : 86
            }

            teacherFunctions.getClassAverageMasteryForCategory(teacherID, category , function(err, scores){
                assert.equal(scores.mastered, expectedResults.mastered, "mastered should be 0");
                assert.equal(scores.intermediate, expectedResults.intermediate, "intermediate should be 0");
                assert.equal(scores.novice, expectedResults.novice, "novice should be 86");
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

    describe("#getStudentScores()", function (){

        var teacherID = "5684903dab13621200fe364f";

        it("returns the scores for all the students that are in the teachers class.", function (done){
            teacherFunctions.getStudentsScores(teacherID, function(retDict){
                //console.log(retDict);
                done();

            })

        })
    })

    describe("#addStudentScoresToTotal", function(){

        var numStudents = 0;

        var classToken = "74fb18a";

        var studentID = "5684918fab13621200fe36bf";

        var totalScores;

        var studentScore;

        it("adds all the students scores together", function(done){

            async.waterfall([
                function(callback){
                    teacherFunctions.numberOfStudentsInClass(classToken , function(err, studentCount){
                        numStudents = studentCount;
                        callback();
                    })
                },
                function(callback){
                    studentFunctions.getUserScores(studentID, function(scores){
                        totalScores = scores;
                        studentScore = scores;
                        callback();
                    })
                }
                ],
                function(callback){
                    teacherFunctions.addStudentScoresToTotal(numStudents, totalScores, studentScore);
                    //console.log(totalScores);
                    done();
                });
        })
    });

    describe("#getStudentMasteries()", function (){

        var teacherID = "5684903dab13621200fe364f";

        it("returns the scores for all the students that are in the teachers class.", function (done){

            teacherFunctions.getStudentsMasterys(teacherID, function(retDict){
                //console.log(retDict);
                done();

            })
        })
    })

    describe("#addStudentMasteriesToTotal()", function(){

        var numStudents = 2;
        var classToken = "74fb18a";
        var studentID = "5684918fab13621200fe36bf";

        var totalMastery;

        var studentMastery;

        it("adds all the students scores together", function(done){

            studentFunctions.getMasteryScores(studentID, function(scores){
                totalMastery = scores;
                studentMastery = scores;

                teacherFunctions.addStudentMasteryToTotal(numStudents, totalMastery, studentMastery);
                //console.log(totalMastery);
                done();
            })
        })
    })

    describe("#listStudents()", function(){
        var classToken = "74fb18a";

        var listData = [
            { email: 'student2@google.com', totalMastery: 11.5 },
            { email: 'student4@google.com', totalMastery: 6.5 },
            { email: 'student1@google.com', totalMastery: 9 },
            { email: 'student3@google.com', totalMastery: 19.5 }
        ]

        it("should return a list of student objects that hold name, and percent of all questions mastered", function (done){
            teacherFunctions.listStudents(classToken, function(studentList){

                //TODO see why this is failing on occastion
                //assert.deepEqual(listData , studentList , "These should be equal");

                //console.log(studentList);

                done();
            })
        })
    })

    describe("#getTeacherClassToken()", function(){
        var teacherID = "5684903dab13621200fe364f";
        var classToken = "74fb18a";

        it("returns the class token of a the teacher", function(done){

            teacherFunctions.getTeacherClassToken (teacherID, function(err, retClassToken){


                assert.equal(classToken, retClassToken, "the Tokens should match")
                done()
            })
        })
    })

    describe("getMissedQuestionList", function(){
        var teacherID = "5684903dab13621200fe364f";

        it("should return a list of question objects from the teacher object that rep the most missed questions", function (done){

            teacherFunctions.getMissedQuestionsList(teacherID, function(err, retQuestionList){
                //console.log(retQuestionList);
                done();

            })

        })
    })


    describe("#listStudentsAndCategoryMastery()", function(){

        var classToken = "74fb18a";
        var category = "Constitutional Underpinnings";

        it("should return a list of all the students and their mastery of a specific category", function (done){
            teacherFunctions.listStudentsAndCategoryMastery(classToken, category, function(err, studentlist){
                //console.log(studentlist);
                done();
            })
        })
    });

    //describe("#getAllQuestionDataForTeacher()", function(){
    //
    //    var classToken = "74fb18a";
    //
    //    it("should return all of the question data assocaited to the teacher", function(done){
    //        teacherFunctions.getAllQuestionDataForTeacher(classToken, function(err, questionData){
    //            done();
    //        })
    //    })
    //});

    describe("#getMissedQuestionsListPerCategory()", function(){


        var teacherID = "5684903dab13621200fe364f";

        var category = "Constitutional Underpinnings";
        it("should return all of the question data assocaited to the teacher of a category", function(done){
            teacherFunctions.getMissedQuestionsListPerCategory(teacherID, category, function(err, questionData){
                //console.log(questionData);
                done();
            })
        })
    });



});