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

    newQuestion.correct = false;

    newQuestion.comprehension =  {
        "mastered": false,
        "intermediate": false,
        "novice": true
    };

    newQuestion.responses = {
        a: 0,
        b: 0,
        c : 0,
        d : 0
    };

    newQuestion.numberOfAttempts = 0;
    newQuestion.incorrectAttempts = 0;
    newQuestion.correctAttempts =0;


    newQuestion.save(function(err , product) {
        if (err) throw err;

        console.log('Question saved successfully!');
        res.redirect("/question");

        DBFunctions.addQuestionToAllUsers(product.id);




    });

}

exports.temp = function(req, res){

    res.render("questionInput");
}
