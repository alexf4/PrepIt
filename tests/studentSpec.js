var expect = require("chai").expect;
var studentFunctions = require("../DBWork/studentFunctions.js");
var dataToChartHelper = require("../views/dataToChartHelper");
var assert = require('chai').assert;
var studentRoute = require("../routes/student");

var DBFunctions = require("../DBWork/DBFunctions");
var async = require('async');

var db = require('../dbWork/db');

db.connect();


describe("Student Route Functions", function(){

    this.timeout(4000);

    describe("#studentPage()", function(){
        it("Will render the student page", function (done){

        var req = {};
        var res = {};

        req.user={};
        req.user._id = "5684918fab13621200fe36bf";



        res.render = function(chunk, encoding) {

            //TODO: Do the asserts here

            //console.log(encoding);

            done();
        };

        studentRoute.studentPage(req, res);

        })
    })
})