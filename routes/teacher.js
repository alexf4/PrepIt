/**
 * Created by alexf4 on 6/9/15.
 */

var DBFunctions = require("../DBWork/DBFunctions");
var dataToChartHelper = require("../views/dataToChartHelper");

exports.teacherPage = function(req, res ){

  //Get the users logged in id
  userId = req.session.passport.user;

  DBFunctions.getStudentsScores(userId, DBFunctions, function(scores){

    //TODO: Might have to switch this to a teacher chart later
    chartData = dataToChartHelper.createStudentChart(scores);

    //TODO: Make this dynamic
    res.render("teacher", {totalData : chartData.totalData , totalOptions : chartData.totalOptions ,
      CUData : chartData.Civil_Rights_and_Liberites_Data, SectionOptions : chartData.sectionOptions,
      Civil_Rights_and_Liberites_Data : chartData.Civil_Rights_and_Liberites_Data,
      Political_Beliefs_and_Behaviors_Data : chartData.Political_Beliefs_and_Behaviors_Data,
      Linkage_Institutions_Data: chartData.Linkage_Institutions_Data,
      Institutions_of_National_Government_Data : chartData.Institutions_of_National_Government_Data,
      Public_Policy_Data : chartData.Public_Policy_Data
    });


  });

};

