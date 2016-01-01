var expect = require("chai").expect;
var dataToChartHelper = require("../views/dataToChartHelper.js");
var studentFunctions = require("../DBWork/studentFunctions.js");
var assert = require('chai').assert;

var db = require('../dbWork/db');

db.connect();

var studentID = "5684918fab13621200fe36bf";

describe("Data to Chart Helper Functions", function(){
    describe("#createStudentChart()", function (){



        it("should return the correct data formated for frontend ", function(done){
            studentFunctions.getUserScores(studentID , function(scores){

                temp = dataToChartHelper.createStudentChart(scores);
                console.log(temp);
                done();
            })
        })
    })

    describe("#createMasteryStudentChart()", function (){


        it("should return the correct data formated for frontend ", function(done){


            studentFunctions.getMasteryScores(studentID, function(scores){
                temp = dataToChartHelper.createStudentMasteryChart(scores);
                console.log(temp);
                done();

            })


        })
    })
})