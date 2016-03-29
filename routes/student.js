/**
 * Created by alexf4 on 6/14/15.
 */


var dataToChartHelper = require("../views/dataToChartHelper");
var studentFunctions = require("../DBWork/studentFunctions");

var DBFunctions = require("../DBWork/DBFunctions");
var async = require('async');

var student = require("./student");

/**
 * This method will check the status of the user and route them correctly
 * @param req
 * @param res
 */
exports.studentPage = function (req, res) {

    //Get the users logged in id
    var userId = req.user._id.toString();

    DBFunctions.isNewUser(userId, function (err, userStatus) {
        if (userStatus) {
            //render new student page
            student.renderNewStudent(req , res);
        }

        //render student dashboard
        student.renderStudentPage(req, res);


    })
};


/**
 * this method is used to show a new student the new student view
 * @param req
 * @param res
 */
exports.renderNewStudent = function (req ,res) {
    var userId = req.user._id.toString();


    DBFunctions.getUserEmail(userId, function (err, email) {


        res.render("newStudent", {userEmail : email});


    });



};


/**
 * This method is used to show a student their dashboard.
 * @param req
 * @param res
 */
exports.renderStudentPage = function(req, res){
    //Get the users logged in id
    var userId = req.user._id.toString();
    var userEmail = "";

    /**
     * This async call will cause a waterfall flow for getting the data from the DB
     */
    async.waterfall([
        function(callback){
            //Get the Category Titles
            DBFunctions.getCategoryTitles(callback)
        },
        function(categories ,callback) {
            DBFunctions.getUserEmail(userId, function (err, email) {
                userEmail = email;
                req.session.userEmail=email;
                callback(null, categories);
            });
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
                        Public_Policy_Data: chartData.Public_Policy_Data,
                        Title: "Student Dashboard",
                        activeSection: "Main View",
                        userEmail : userEmail
                    });

            });

        });
};