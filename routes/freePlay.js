/**
 * Created by beckyedithbrooker on 7/18/15.
 */
var freePlayLogic = require("../GameLogic/FreePlayLogic");
var userModel = require("../models/user");
var category;

exports.setCategory=function(category){
    this.category=category;
};

exports.startFreePlay = function(req, res) {

    //grab a question that the user has not gotten right
    //Get the users logged in id
    userId = req.session.passport.user;

    req.session.category="All Categories";

    //TODO: try to clean this up and not need it (figure out how to call category play)
    freePlayLogic.getQuestion(userId, function(question){


        res.render("FreePlayQuestion", {
            question: question ,
            questionID : question._id.toString(),
            Title: "All Categories",
            activeSection: "Freeplay",
            activeSubsection: req.session.category});
    })

    //Pass the question to render

};

exports.startCategoryPlay = function(req, res){
    //grab a question that the user has not gotten right
    //Get the users logged in id
    userId = req.session.passport.user;

    //TODO: try to not make only one render call and add suport for highlighting what the current category is
    if (req.session.category===null||req.session.category==="All Categories")
    {
        req.session.category="All Categories";

        freePlayLogic.getQuestion(userId, function(question){

            res.render("FreePlayQuestion", {
                question: question ,
                questionID : question._id.toString(),
                Title: "All Categories",
                activeSection: "Freeplay",
                activeSubsection: req.session.category});

        })
    }
    else {
        freePlayLogic.getQuestionFromCategory(userId, req.session.category, function (question) {

            res.render("FreePlayQuestion", {
                question: question,
                questionID: question._id.toString(),
                Title: req.session.category,
                activeSection: "Freeplay",
                activeSubsection: req.session.category});

        })
    }
}

    exports.submitAnswer = function(req, res){

    //grab the questions correct answer

    userId = req.session.passport.user;

    //compare to users input

    freePlayLogic.checkAnswer(userId, req.body.answer, req.body.questionId ,  function(result){

            res.render("FreePlayReview" , {
                question : result.question ,
                correct : result.correct ,
                correctSolution : result.question.solution,
                Title: "Question Review",
                activeSection: "Freeplay",
                activeSubsection: req.session.category});
    })

};