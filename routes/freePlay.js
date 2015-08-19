/**
 * Created by beckyedithbrooker on 7/18/15.
 */
var freePlayLogic = require("../GameLogic/FreePlayLogic");
var userModel = require("../models/user");

exports.startFreePlay = function(req, res) {


    //grab a question that the user has not gotten right
    //Get the users logged in id
    userId = req.session.passport.user;



    userModel.findById(userId , function (err, user){


        var foundUser = new userModel;

        foundUser = user;

        var questions = user.questions;

        user.isteacher = false;

        var count = 0;

        questions.forEach(function (entry){
            count ++;
            if (entry._id.toString() == "55b13b7689484e1300065781"){
                entry.correct = true;


            }
        })

        user.questions = null;

        user.save(function (err , product, number) {
            console.log("temp");

            user.questions = questions;

            user.save(function (err, product, number){
                console.log("madeit");
            })
        })


        //user.update
        //
        //
        //var comment = post.comments.id(my_id);
        //comment.author = 'Bruce Wayne';
        //
        //post.save(function (err) {
        //    // emmbeded comment with author updated
        //});

    })


    //freePlayLogic.getQuestion(userId, function(questionData){
    //
    //
    //
    //    //res.render(question card)
    //    res.render("FreePlayQuestion" , {questionData : "temp"});
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
        }else{
            //res.render incorect
        }
        //res.render correct
        //else show the correct answer
        //res.render incorrect
    })

};