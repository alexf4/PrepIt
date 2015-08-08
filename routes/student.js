/**
 * Created by alexf4 on 6/14/15.
 */

var DBFunctions = require("../DBWork/DBFunctions");
var Dict = require("collections/dict");


exports.studentPage = function(req, res ) {

  //TODO Need to get rid of req.user


  //Get the users logged in id
  userId = req.session.passport.user;

  //Get the stats of the user
  userScores = DBFunctions.getUserScores(userId, function(Scores){



    res.render("student");
  });


};