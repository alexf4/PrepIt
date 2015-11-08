/**
 * Created by alexf4 on 8/9/15.
 */
var Dict = require("collections/dict");
var List = require("collections/list");

exports.createStudentChart = function (scores) {

    //Will return a set of data objects
    var retDict = new Dict;

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
        responsive: true
    };

    var sectionOptions = {
        segmentShowStroke: true,
        segmentStrokeColor: "#fff",
        segmentStrokeWidth: 2,
        percentageInnerCutout: 45, // This is 0 for Pie charts
        animationSteps: 100,
        animationEasing: "easeOutBounce",
        animateRotate: true,
        animateScale: false,
        responsive: true
    };


    retDict.set("totalData", calculateTotalScore(scores));
    retDict.set("totalOptions", totalOptions);
    retDict.set("sectionOptions", sectionOptions);


    //Create the return chart data object
    var formattedChartData = {};


    var sectionArray = scores.entries();

    sectionArray.forEach(function (entry) {
        var sectionData = entry[1];

        if (entry[0] != "totalQuestions") {
            if (entry[0] != "totalCorrect") {
                retDict.set(entry[0] + " Data", calculateSectionScore(sectionData, entry[0]))
            }
        }


    });

    //Add meta data sections to the ret object
    formattedChartData["totalData"] = retDict.get("totalData");
    formattedChartData["totalOptions"] = retDict.get("totalOptions");
    formattedChartData["sectionOptions"] = retDict.get("sectionOptions");

    //For each question section in scores object add it to the return object.
    sectionArray.forEach(function (entry) {

        if (entry[0] != "totalQuestions") {
            if (entry[0] != "totalCorrect") {
                formattedChartData[entry[0].replace(/\s/g, "_") + "_Data"] = retDict.get(entry[0] + " Data");
            }
        }
    });

    return formattedChartData
};

function calculateTotalScore(scores) {

    var totalDataList = [];

    var totalPercentCorrect = 0;

    var scoresArray = scores.entries();

    scoresArray.forEach(function (entry) {
         var sectionData = entry[1];

        if (entry[0] != "totalQuestions") {
            if (entry[0] != "totalCorrect") {

                 var sectionValue = sectionData.correct / sectionData.questions * sectionData.testPercent * .1;

                //add to total correct count
                totalPercentCorrect += sectionValue;

                var totalChartData = {
                    value: sectionValue,
                    label: entry[0],
                    color: "#a3e1d4",
                    highlight: "#1ab394"
                };

                totalDataList.push(totalChartData);
            }
        }
    });


    //Change color depending on how many they have got right

    //Figure out how many questions are missing
    var totalChartData = {
        value: 100 - totalPercentCorrect,
        label: "Percent Left to answer",
        color: "#FF0000",
        highlight: "#0000FF"
    };

    totalDataList.push(totalChartData);

    return totalDataList;
}


function calculateSectionScore(scores, sectionTitle) {

    var totalDataList = [];

    var correctData = {
        value: scores.correct / scores.questions * 100,
        label: sectionTitle,
        color: "#a3e1d4",
        highlight: "#1ab394"
    };

    var incorrectData = {
        value: 100 - (scores.correct / scores.questions * 100),
        label: "Percent Incorrect",
        color: "#FF0000",
        highlight: "#1ab394"
    };

    totalDataList.push(correctData);
    totalDataList.push(incorrectData);

    return totalDataList;

}