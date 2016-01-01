/**
 * Created by alexf4 on 6/14/15.
 */


var dataToChartHelper = require("../views/dataToChartHelper");
var studentFunctions = require("../DBWork/studentFunctions");

var DBFunctions = require("../DBWork/DBFunctions");
var async = require('async');


/**
 *
 * @param req
 * @param res
 */
exports.studentPage = function (req, res) {

    //Get the users logged in id
    var userId = req.session.passport.user;

    /**
     * This async call will cause a waterfall flow for getting the data from the DB
     */
    async.waterfall([
        function(callback){
            //Get the Category Titles
            DBFunctions.getCategoryTitles(callback)
        }
    ],
        //Once we have the Category titles we can do the rendering
        function(err, categories){
            //Get the stats of the user
            studentFunctions.getMasteryScores(userId, function (scores) {

                var chartData = dataToChartHelper.createStudentMasteryChart(scores);

                //TODO: Make this dynamic. We have a list of categories, but we need to clean up the names we use here
                //TODO: Cody can now render pass into the student page the side bar information on the categories.
                res.render("student",
                    {
                        //TODO: need to figure out what the total data will look like
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

        });
};