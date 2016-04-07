// var expect = require("chai").expect;
// var dataToChartHelper = require("../views/dataToChartHelper.js");
// var cacheFunctions = require("../DBWork/cacheFunctions.js");
// var assert = require('chai').assert;
//
//
// var teacherFunctions = require("../DBWork/teacherFunctions");
//
// var dataToChartHelper = require("../views/dataToChartHelper");
//
// var studentFunctions = require("../DBWork/studentFunctions");
//
// var DBFunctions = require("../DBWork/DBFunctions.js");
//
// var teacher = require("../routes/teacher.js");
//
// var async = require('async');
//
// var db = require('../dbWork/db');
//
// db.connect();
//
// describe("cache functions spec", function () {
//     describe("#createTeacherData()", function () {
//
//         this.timeout(400000);
//         it("should return the correct data formated for frontend ", function (done) {
//
//             var userId = "56cd26e619d1500e0084d858"
//             var chartData = null;
//             var tstudentsList = null;
//             var questionList = null;
//
//             async.waterfall([
//                     function (callback) {
//                         //Get the teachers students scores/masteries
//
//                         teacherFunctions.getStudentsMasterys(userId, function (scores) {
//
//                             callback(null, scores)
//                         })
//                     },
//                     function (scores, callback) {
//                         //Convert the scores into a format the front end can consume
//
//                         chartData = dataToChartHelper.createStudentMasteryChart(scores);
//
//                         callback(null)
//                     },
//                     function (callback) {
//
//                         //find the teachers class token
//
//                         teacherFunctions.getTeacherClassToken(userId, function (err, classToken) {
//                             this.classToken = classToken;
//
//                             callback(null, classToken)
//                         })
//                     },
//                     function (classToken, callback) {
//
//
//                         //create the list of the students in the class
//                         teacherFunctions.listStudents(classToken, function (err, students) {
//                             tstudentsList = students;
//
//                             callback(null)
//                         })
//                     },
//                     function (callback) {
//
//
//                         //create the list of missed questions
//                         teacherFunctions.getMissedQuestionsList(userId, function (err, questions) {
//                             questionList = questions;
//
//                             callback(null);
//                         })
//                     }
//                 ], function () {
//
//                     console.log("got here");
//
//
//                     cacheFunctions.createTeacherData(userId, chartData, tstudentsList, questionList, function (err, worked) {
//
//                         done()
//                     })
//
//                 }
//             );
//         })
//     })
//
//     describe("testing get TeacherData", function () {
//         it("should work", function (done) {
//
//             var userId = "56cd26e619d1500e0084d858";
//
//             cacheFunctions.getTeacherData(userId, function (err, worked) {
//                 done();
//             })
//
//         })
//
//     });
//
//     describe.only("testing get TeacherData2", function () {
//         it("should not work", function (done) {
//
//             var userId = "56d36f8f5004e41500a83613";
//
//             cacheFunctions.getTeacherData(userId, function (err, worked) {
//                 done();
//             })
//
//         })
//
//     })
// });
//
//
