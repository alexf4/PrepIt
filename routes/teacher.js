/**
 * Created by alexf4 on 6/9/15.
 */


exports.teacherPage = function(req, res ){

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

