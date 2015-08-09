/**
 * Created by alexf4 on 6/14/15.
 */

var DBFunctions = require("../DBWork/DBFunctions");
var Dict = require("collections/dict");
var dataToChartHelper = require("../views/dataToChartHelper");


exports.studentPage = function(req, res ) {

  //TODO Need to get rid of req.user


  //Get the users logged in id
  userId = req.session.passport.user;

  //Get the stats of the user
  userScores = DBFunctions.getUserScores(userId, function(scores){

    chartData = dataToChartHelper.createStudentChart(scores);

    //TODO Switch back
    //res.render("student");
    res.render("teacher", {totalData:chartData.get("totalData"), totalOptions:chartData.get("totalOptions"),
      CUData: chartData.get("totalData"), CUOptions: chartData.get("totalOptions")});
  });


};