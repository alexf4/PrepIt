/**
 * Created by alexf4 on 7/11/15.
 */


var question = require("../models/question");

var DBFunctions = require("../DBWork/DBFunctions");


exports.addQuestion = function(req, res){

    var newQuestion = new question();

    //newQuestion.category = "institutionsOfNationalGovernment";
    newQuestion.category = req.param("Category");

    newQuestion.subcategory = req.param("SubCategory");
    //newQuestion.subcategory = "space";

    //newQuestion.text ="Which sector of the bureaucracy is NASA a part of?";
    newQuestion.questionText = req.param("QuestionText");

    //newQuestion.answers = {"a": "Cabinet Department" , b: "Government Corporation",
    //    c: "Independent Executive Agency" , d:"Independent Regulatory Commission" };

    newQuestion.answers = {"a": req.param("A") , b: req.param("B"),
        c: req.param("C") , d:req.param("D") };

    newQuestion.solution = req.param("solution");


    newQuestion.save(function(err , product) {
        if (err) throw err;

        console.log('Question saved successfully!');
        res.redirect("/question");

        //TODO Need to update all questions sets of users
        //For each user add a copy of this question

        //Find the id
        //question.findOne({ 'QuestionText' :  newQuestion.questionText }, function(err, question) {
        //
        //    if (err){
        //        console.log('Question not found '+err);
        //        return done(err);
        //    }
        //    // already exists
        //    if (question) {
        //        //console.log('User already exists with username: '+username);
        //        //TODO: Need to catch this
        //        //return done(null, false, req.flash('message','User Already Exists'));
        //
        //        //Get this objects ID
        //        DBFunctions.addQuestionToAllUsers();
        //    }
        //
        //});

        DBFunctions.addQuestionToAllUsers(product.id);




    });

}

exports.temp = function(req, res){

    res.render("questionInput");
}
