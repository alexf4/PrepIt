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

    req.session.category=null;

    //TODO: try to clean this up and not need it (figure out how to call category play)
    freePlayLogic.getQuestion(userId, function(question){


        res.render("FreePlayQuestion", { question: question , questionID : question._id.toString()});
    })

    //Pass the question to render

};

exports.startCategoryPlay = function(req, res){
    //grab a question that the user has not gotten right
    //Get the users logged in id
    userId = req.session.passport.user;

    //TODO: try to not make only one render call and add suport for highlighting what the current category is
    if (req.session.category===null)
    {
        freePlayLogic.getQuestion(userId, function(question){

            res.render("FreePlayQuestion", { question: question , questionID : question._id.toString()});

        })
    }
    else {
        freePlayLogic.getQuestionFromCategory(userId, req.session.category, function (question) {

            res.render("FreePlayQuestion", {question: question, questionID: question._id.toString()});

        })
    }
}

    exports.submitAnswer = function(req, res){

    //grab the questions correct answer

    userId = req.session.passport.user;

    //compare to users input

    freePlayLogic.checkAnswer(userId, req.body.answer, req.body.questionId ,  function(result){

        //IF result object has a correct then show answer
        if(result.correct){
            res.render("FreePlayReview" , {question : result.question , correct : true , correctSolution : result.question.solution});
        }else{
            res.render("FreePlayReview" , {question : result.question , correct: false, correctSolution : result.question.solution});

        }

    })

};