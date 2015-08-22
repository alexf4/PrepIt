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
        res.send (question.questionText);
    })



    //userModel.findById(userId , function (err, user){
    //
    //
    //    var questions = user.questions;
    //
    //
    //    questions.forEach(function (entry){
    //
    //        if (entry._id.toString() == "55b13b7689484e1300065781"){
    //            entry.correct = true;
    //        }
    //    })
    //
    //    user.questions = null;
    //
    //    user.save(function (err , product, number) {
    //        console.log("temp");
    //
    //        user.questions = questions;
    //
    //        user.save(function (err, product, number){
    //            console.log("madeit");
    //        })
    //    })
    //
    //})





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
            res.send("correct");
        }else{
            res.send("wrong");
            //res.render incorrect
        }
        //res.render correct
        //else show the correct answer
        //res.render incorrect
    })

};