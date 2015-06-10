/**
 * Created by alexf4 on 6/9/15.
 */


exports.teacherPage = function(req, res ){


  var doughnutData = [
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

  var doughnutOptions = {
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



  res.render("teacher", {data: doughnutData, options: doughnutOptions});

};

