/**
 * Created by beckyedithbrooker on 7/18/15.
 */
var freePlayLogic = require("../GameLogic/FreePlayLogic");

exports.startFreePlay = function(req, res) {


    //grab a question that the user has not gotten right
    //Get the users logged in id
    userId = req.session.passport.user;

    freePlayLogic.getQuestion(userId, function(questionData){



        //res.render(question card)
        res.render("FreePlayQuestion" , {questionData : "temp"});

    })



    //Pass the question to render

};

exports.submitAnswer = function(req, res){

    //grab the questions correct answer

    userId = req.session.passport.user;

    //compare to users input

    freePlayLogic.checkAnswer(userId, userAnswer, questionID ,  function(result){

        //IF result object has a correct then show answer
        if(result.correct){
            //res.render correct
        }else{
            //res.render incorect
        }
        //res.render correct
        //else show the correct answer
        //res.render incorrect
    })

};