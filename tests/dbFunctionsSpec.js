var expect = require("chai").expect;
var DBFunctions = require("../DBWork/DBFunctions.js");
var assert = require('chai').assert;

var db = require('../dbWork/db');

db.connect();



describe ("DB Functions" , function (){
    describe ("#getNumberOfQuestionsPerCategory()", function (){
        it("should return the number of questions in the db of a specific category" , function(done){

            var category = "Constitutional Underpinnings";

            DBFunctions.getNumberOfQuestionsPerCategory(category, function(err, questionCount){
                assert.equal(24, questionCount, "The number of questions in a category");
                done();
            })

        })
    })

})