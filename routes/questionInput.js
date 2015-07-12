/**
 * Created by alexf4 on 7/11/15.
 */



var question = require("../models/question");


exports.addQuestion = function(req, res){

    var newQuestion = new question();

    newQuestion.category = "institutionsOfNationalGovernment";
    newQuestion.subcategory = "space";
    newQuestion.text ="Which sector of the bureaucracy is NASA a part of?";
    newQuestion.answers = {"a": "Cabinet Department" , b: "Government Corporation",
        c: "Independent Executive Agency" , d:"Independent Regulatory Commission" };


    newQuestion.save(function(err) {
        if (err) throw err;

        console.log('Question saved successfully!');
        res.send("Question saved Succesfully");
    });

}

exports.temp = function(req, res){

    res.render("questionInput");
}
