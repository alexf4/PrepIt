/**
 * Created by alexf4 on 6/14/15.
 */

var DBFunctions = require("../DBWork/DBFunctions");
var dataToChartHelper = require("../views/dataToChartHelper");


exports.studentPage = function (req, res) {

    //TODO Need to get rid of req.user


    //Get the users logged in id
    var userId = req.session.passport.user;

    //Get the stats of the user
    DBFunctions.getUserScores(userId, function (scores) {

        var chartData = dataToChartHelper.createStudentChart(scores);

        //TODO: Make this dynamic
        res.render("student",
            {
                totalData: chartData.totalData,
                totalOptions: chartData.totalOptions,
                CUData: chartData.Constitutional_Underpinnings_Data,
                SectionOptions: chartData.sectionOptions,
                Civil_Rights_and_Liberties_Data: chartData.Civil_Rights_and_Liberties_Data,
                Political_Beliefs_and_Behaviors_Data: chartData.Political_Beliefs_and_Behaviors_Data,
                Linkage_Institutions_Data: chartData.Linkage_Institutions_Data,
                Institutions_of_National_Government_Data: chartData.Institutions_of_National_Government_Data,
                Public_Policy_Data: chartData.Public_Policy_Data
            });

    });


};