/**
 * Created by alexf4 on 8/9/15.
 */
var Dict = require("collections/dict");
var List = require("collections/list");

exports.createStudentChart = function (scores){

    //Will return a set of data objects
    var retDict = new Dict;

    var totalDataList = new List;

    scoresArray = scores.entries();

    scoresArray.forEach (function (entry){
        sectionData = entry[1];

        sectionValue = sectionData.correct * sectionData.testPercent * .1;

        totalChartData = {
            value : sectionValue,
            label : entry[0],
            color: "#a3e1d4",
            highlight: "#1ab394"
        }

        totalDataList.push(totalChartData);

    });


    //TODO This should work, skipping for time.
    ////Setup the total chart data
    //scores.forEach(function (entry){
    //    sectionValue = entry.correct * entry.testPercent * .1;
    //    totalChartData = {
    //        value : sectionValue,
    //        label : entry
    //    }
    //})

    //Setup the total chart options
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


    retDict.set("totalData" , totalDataList);
    retDict.set("totalOptions", totalOptions);


    return retDict;

}