/**
 * Created by alexf4 on 4/6/16.
 */

var teacherData = require("../models/teacherData");
var cacheFunctions = require("./cacheFunctions.js");
var dataToChartHelper = require("../views/dataToChartHelper");
var teacherFunctions = require("./teacherFunctions");

var async = require('async');

exports.getTeacherData = function (userId, callback) {

    //Try to find the teacher data object
    teacherData.find({userId: userId}, function (err, foundItems) {

        //If there is nothing in the cache for this user
        if (err) {

            callback(null, null);

        }
        else if (foundItems.length == 0) {
            cacheFunctions.updateTeacherDataCache(userId, function (err, data) {
                var foundData = {
                    chartData: JSON.stringify(data.chartData),
                    studentsList: JSON.stringify(data.studentsList),
                    questionList: JSON.stringify(data.questionList)
                }

                cacheFunctions.createTeacherData(userId, data.chartData, data.studentsList, data.questionList, function (err, whocares) {
                    callback(null, foundData);
                })


            })
        } else { //if we have something in the cache for the user

            var foundData = {
                chartData: foundItems[0].chartData,
                studentsList: foundItems[0].studentsList,
                questionList: foundItems[0].questionList
            }



            cacheFunctions.updateTeacherDataCache(userId, function (err, done) {

            })

            callback(null, foundData);
        }
    });

}

exports.updateTeacherDataCache = function (userId, rCallback) {
    var chartData = null;
    var tstudentsList = null;
    var questionList = null;

    async.waterfall([
            function (callback) {
                //Get the teachers students scores/masteries

                teacherFunctions.getStudentsMasterys(userId, function (scores) {

                    callback(null, scores)
                })
            },
            function (scores, callback) {
                //Convert the scores into a format the front end can consume

                chartData = dataToChartHelper.createStudentMasteryChart(scores);

                callback(null)
            },
            function (callback) {

                //find the teachers class token

                teacherFunctions.getTeacherClassToken(userId, function (err, classToken) {
                    this.classToken = classToken;

                    callback(null, classToken)
                })
            },
            function (classToken, callback) {


                //create the list of the students in the class
                teacherFunctions.listStudents(classToken, function (err, students) {
                    tstudentsList = students;

                    callback(null)
                })
            },
            function (callback) {


                //create the list of missed questions
                teacherFunctions.getMissedQuestionsList(userId, function (err, questions) {
                    questionList = questions;

                    callback(null);
                })
            }
        ], function () {

            console.log("got here");

            var foundData = {
                chartData: chartData,
                studentsList: tstudentsList,
                questionList: questionList
            };

            rCallback(null, foundData);

        }
    );

};


exports.createTeacherData = function (userId, chartData, tstudentsList, questionList, callback) {

    var newData = new teacherData();

    newData.userId = userId;
    newData.chartData = JSON.stringify(chartData);
    newData.studentsList = JSON.stringify(tstudentsList);
    newData.questionList = JSON.stringify(questionList);

    newData.save(function (err, result) {
        callback(err, result);
    })
};

exports.updateTeacherData = function (userId, chartData, tstudentsList, questionList, callback) {

    teacherData.find({userId: userId}, function (err, foundItems) {

        var foundTeacherData = foundItems[0];

        foundTeacherData.chartData = JSON.stringify(chartData);
        foundTeacherData.studentsList = JSON.stringify(tstudentsList);
        foundTeacherData.questionList = JSON.stringify(questionList);

        foundTeacherData.save(function (err, result) {
            callback(err, result);
        })

    });
};