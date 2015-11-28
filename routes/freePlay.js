/**
 * Created by beckyedithbrooker on 7/18/15.
 */
var freePlayLogic = require("../GameLogic/FreePlayLogic");
var userModel = require("../models/user");

exports.startFreePlay = function(req, res) {

    //grab a question that the user has not gotten right
    //Get the users logged in id
    userId = req.session.passport.user;


    freePlayLogic.getQuestion(userId, function(question){


        res.render("FreePlayQuestion", { question: question , questionID : question._id.toString()});
    })

    //Pass the question to render

};

//TODO: Cody, find a way to pass in what was clicked so we know what category was clicked
exports.startCategoryPlay = function(req, res){
    //grab a question that the user has not gotten right
    //Get the users logged in id
    userId = req.session.passport.user;

    /**
     * get a question from category "temp"
     */
    freePlayLogic.getQuestionFromCategory(userId, "temp", function(question){

        res.render("FreePlayQuestion", { question: question , questionID : question._id.toString()});
    })
}

    exports.submitAnswer = function(req, res){

    //grab the questions correct answer

    userId = req.session.passport.user;

    //compare to users input

    freePlayLogic.checkAnswer(userId, req.body.answer, req.body.questionId ,  function(result){

        //IF result object has a correct then show answer
        if(result.correct){
            //res.render correct
            //res.send("correct");
            res.render("FreePlayReview" , {question : result.question , correct : true , correctSolution : result.question.solution});
        }else{
            //res.send("wrong");
            res.render("FreePlayReview" , {question : result.question , correct: false, correctSolution : result.question.solution});
            //res.render incorrect
        }
        //res.render correct
        //else show the correct answer
        //res.render incorrect
    })

};