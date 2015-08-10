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


    //TODO: Make this dynamic
    res.render("teacher", {totalData : chartData.totalData , totalOptions : chartData.totalOptions ,
      CUData : chartData.Civil_Rights_and_Liberites_Data, SectionOptions : chartData.sectionOptions,
      Civil_Rights_and_Liberites_Data : chartData.Civil_Rights_and_Liberites_Data,
      Political_Beliefs_and_Behaviors_Data : chartData.Political_Beliefs_and_Behaviors_Data,
      Linkage_Institutions_Data: chartData.Linkage_Institutions_Data,
      Institutions_of_National_Government_Data : chartData.Institutions_of_National_Government_Data,
      Public_Policy_Data : chartData.Public_Policy_Data

    });

    //res.render("teacher", {totalData: chartData.get("totalData") , totalOptions: chartData.get("totalOptions"), CUData : chartData.get("totalData"), CUOptions : chartData.get("totalOptions")});
  });


};