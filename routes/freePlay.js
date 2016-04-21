/**
 * Created by beckyedithbrooker on 7/18/15.
 */
var freePlayLogic = require("../GameLogic/FreePlayLogic");
var DBFunctions = require("../DBWork/DBFunctions.js");
var userModel = require("../models/user");
var category;


exports.setCategory=function(category){
    this.category=category;
};

exports.startFreePlay = function(req, res) {

    //grab a question that the user has not gotten right
    //Get the users logged in id
    var userId = req.user._id.toString();

    req.session.category="All Categories";

    //TODO: try to clean this up and not need it (figure out how to call category play)
    freePlayLogic.getQuestion(userId, function(question){

        DBFunctions.getUserEmail(userId, function (err, email) {
            var userEmail = email;



            res.render("FreePlayQuestion", {
                question: question,
                questionID: question._id.toString(),
                Title: "All Categories",
                activeSection: "Freeplay",
                activeSubsection: req.session.category,
                userEmail: userEmail
            });
        });
    });

    //Pass the question to render

};

exports.startCategoryPlay = function(req, res){
    //grab a question that the user has not gotten right
    //Get the users logged in id
    var userId = req.user._id.toString();

    //TODO: try to not make only one render call and add suport for highlighting what the current category is
    if (req.session.category===null||req.session.category==="All Categories")
    {
        req.session.category="All Categories";

        freePlayLogic.getQuestion(userId, function(question){

            DBFunctions.getUserEmail(userId, function (err, email) {
                var userEmail = email;


                res.render("FreePlayQuestion", {
                    question: question,
                    questionID: question._id.toString(),
                    Title: "All Categories",
                    activeSection: "Freeplay",
                    activeSubsection: req.session.category,
                    userEmail: userEmail
                });
            });
        })
    }
    else {
        freePlayLogic.getQuestionFromCategory(userId, req.session.category, function (err, question) {

            DBFunctions.getUserEmail(userId, function (err, email) {
                var userEmail = email;


                res.render("FreePlayQuestion", {
                    question: question,
                    questionID: question._id.toString(),
                    Title: "Freeplay",
                    activeSection: "Freeplay",
                    activeSubsection: req.session.category,
                    userEmail: userEmail
                });
            });

        })
    }
};

    exports.submitAnswer = function(req, res){

    //grab the questions correct answer

        var userId = req.user._id.toString();

    //compare to users input

    freePlayLogic.checkAnswer(userId, req.body.answer, req.body.questionId ,  function( result){

            res.render("FreePlayReview" , {
                question : result.question ,
                correct : result.correct ,
                correctSolution : result.question.solution,
                Title: "Question Review",
                activeSection: "Freeplay",
                activeSubsection: req.session.category});
    })

};