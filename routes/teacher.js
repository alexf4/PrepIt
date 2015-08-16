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
    chartdata = dataToChartHelper.createStudentChart(scores);

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


  //Total Data stub
  var totalData = [
    {
      value: 300,
      color: "#a3e1d4",
      highlight: "#1ab394",
      label: "Constitutional Underpinnings"
    },
    {
      value: 50,
      color: "#dedede",
      highlight: "#1ab394",
      label: "Political Beliefs and Behaviors"
    },
    {
      value: 100,
      color: "#b5b8cf",
      highlight: "#1ab394",
      label: "Linkage Institutions"
    },
    {
      value: 300,
      color: "#a3e1d4",
      highlight: "#1ab394",
      label: "Institutions of National Government"
    },
    {
      value: 50,
      color: "#dedede",
      highlight: "#1ab394",
      label: "Public Policy"
    },
    {
      value: 100,
      color: "#b5b8cf",
      highlight: "#1ab394",
      label: "Civil Liberties"
    },
    {
      value: 300,
      color: "#a3e1d4",
      highlight: "#1ab394",
      label: "Not Done"
    }
  ];

  //Total options
  var totalOptions = {
    segmentShowStroke: true,
    segmentStrokeColor: "#fff",
    segmentStrokeWidth: 2,
    percentageInnerCutout: 45, // This is 0 for Pie charts
    animationSteps: 100,
    animationEasing: "easeOutBounce",
    animateRotate: true,
    animateScale: false,
    responsive: true,
  };



//This is the Constitiutional Underpinnings
  var CUData = [
    {
      value: 300,
      color: "#a3e1d4",
      highlight: "#1ab394",
      label: "App"
    },
    {
      value: 50,
      color: "#dedede",
      highlight: "#1ab394",
      label: "Software"
    },
    {
      value: 100,
      color: "#b5b8cf",
      highlight: "#1ab394",
      label: "Laptop"
    }
  ];

  var CUOptions = {
    segmentShowStroke: true,
    segmentStrokeColor: "#fff",
    segmentStrokeWidth: 2,
    percentageInnerCutout: 45, // This is 0 for Pie charts
    animationSteps: 100,
    animationEasing: "easeOutBounce",
    animateRotate: true,
    animateScale: false,
    responsive: true,
  };

  res.render("teacher", {totalData:totalData, totalOptions:totalOptions, CUData: CUData, CUOptions: CUOptions});

};

