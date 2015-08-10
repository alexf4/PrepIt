/**
 * Created by alexf4 on 8/9/15.
 */
var Dict = require("collections/dict");
var List = require("collections/list");

exports.createStudentChart = function (scores){

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
        responsive: true,
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
        responsive: true,
    };


    retDict.set("totalData" , calculateTotalScore(scores));
    retDict.set("totalOptions", totalOptions);
    retDict.set("sectionOptions", sectionOptions);


    //For each section calculate the score

    sectionArray = scores.entries();

    sectionArray.forEach (function (entry){
        sectionData = entry[1];

        if (entry[0] != "totalQuestions"){
            if (entry[0] != "totalCorrect"){
                retDict.set(entry[0]+ " Data", calculateSectionScore(sectionData , entry[0]))
            }
        }
    });


    //TODO: Make this dynamic

    formatedChartData = {
        totalData: retDict.get("totalData"),
        totalOptions: retDict.get("totalOptions"),
        sectionOptions: retDict.get("sectionOptions"),
        Civil_Rights_and_Liberites_Data: retDict.get("Civil Rights and Liberties Data"),
        Constitutional_Underpinnings_Data : retDict.get("Constitutional Underpinnings Data"),
        Political_Beliefs_and_Behaviors_Data : retDict.get("Political Beliefs and Behaviors Data"),
        Linkage_Institutions_Data : retDict.get("Linkage Institutions Data"),
        Institutions_of_National_Government_Data : retDict.get("Institutions of National Government Data"),
        Public_Policy_Data : retDict.get("Public Policy Data")


    };

    return formatedChartData

}

function calculateTotalScore(scores){

    var totalDataList = [];

    var totalPercentCorrect = 0;

    scoresArray = scores.entries();

    scoresArray.forEach (function (entry){
        sectionData = entry[1];

        if (entry[0] != "totalQuestions"){
            if (entry[0] != "totalCorrect"){

                sectionValue = sectionData.correct / sectionData.questions * sectionData.testPercent * .1;

                //add to total correct count
                totalPercentCorrect += sectionValue;

                totalChartData = {
                    value: sectionValue,
                    label: entry[0],
                    color: "#a3e1d4",
                    highlight: "#1ab394"
                }

                totalDataList.push(totalChartData);
            }
        }
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

    //Change color depending on how many they have got right

    //Figure out how many questions are missing
    totalChartData = {
        value : 100 - totalPercentCorrect,
        label : "Percent Left to answer",
        color : "#FF0000",
        highligt : "#0000FF"
    }

    totalDataList.push(totalChartData);

    return totalDataList;
}


function calculateSectionScore(scores , sectionTitle){

    var totalDataList = [];

    correctData = {
        value: scores.correct / scores.questions * 100,
        label: sectionTitle,
        color: "#a3e1d4",
        highlight: "#1ab394"
    }

    incorrectData = {
        value: 100 - (scores.correct / scores.questions * 100),
        label: "Percent Incorrect",
        color: "#FF0000",
        highlight: "#1ab394"
    }

    totalDataList.push(correctData);
    totalDataList.push(incorrectData);

    return totalDataList;

}