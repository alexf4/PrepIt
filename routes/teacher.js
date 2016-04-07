/**
 * Created by alexf4 on 6/9/15.
 */

var teacherFunctions = require("../DBWork/teacherFunctions");
var cacheFunction = require("../DBWork/cacheFunctions.js");

var dataToChartHelper = require("../views/dataToChartHelper");

var studentFunctions = require("../DBWork/studentFunctions");

var DBFunctions = require("../DBWork/DBFunctions.js");

var teacher = require("./teacher.js");

var async = require('async');

var PerfCollector = require('perfcollector.js');

// Initialize a performance collector, enable it.
var perfs = PerfCollector.create().enable();

var category;
var studentEmail;
var questionText;
var classToken;
var userEmail;

exports.setCategory = function (category) {
    this.category = category;
};

exports.setStudent = function (studentEmail) {
    this.studentEmail = studentEmail;
};

exports.setQuestionText = function (questionText) {
    this.questionText = questionText;
};

var setUserEmail = function (inputUserEmail) {
    userEmail = inputUserEmail;
};

exports.emptyOutSessionData = function (req) {
    req.session.category = null;
    req.session.studentEmail = null;
    req.session.questionText = null;
    req.session.questionID = null;
    //req.session.userEmail = null;
};


exports.renderStudentList = function (req, res) {


    var userId = req.user._id.toString();
    //find the teachers class token
    teacherFunctions.getTeacherClassToken(userId, function (err, classToken) {

        teacherFunctions.listStudents(classToken, function (err, tstudentsList) {
            res.render("studentList", {
                studentsList: tstudentsList,
                activeSection: "Student_Analysis",
                Title: "Student Analysis",
                ClassCode: this.classToken,
                userEmail: userEmail
            });
        });

    });

};

exports.teacherDrillDown = function (req, res) {

    //figure out what session data there is

    //if student, load student page
    if (req.session.studentEmail) {
        //Render the student version of a view for the teacher
        teacher.renderStudentView(req, res);
    }

    //if category, load only category data
    else if (req.session.category) {
        //Render the views with a specific category
        teacher.renderCategoryView(req, res);

    }
    //if question, load only question data
    else if (req.session.questionID) {
        //render the views with a specific question
        teacher.renderQuestionView(req, res);
    }
    else {
        //render standard view

        teacher.teacherPage(req, res);
    }

    //empty out session data
    //TODO: may have to update the class vars.

    //I want to keep session data so if user calls refresh it still works
    //teacher.emptyOutSessionData(req);

};

exports.renderStudentView = function (req, res) {
    //Find the users ID from their email

    var studentScores;

    var studentID;

    var teacherEmail;

    studentFunctions.getStudentFromEmail(req.session.studentEmail, function (err, inputStudentID) {
        studentID = inputStudentID;


        studentFunctions.getMasteryScores(studentID, function (scores) {

            studentScores = scores;

            var chartData = dataToChartHelper.createStudentMasteryChart(scores);

            //TODO: Make this dynamic. We have a list of categories, but we need to clean up the names we use here
            //TODO: Cody can now render pass into the student page the side bar information on the categories.
            //TODO: Change to use the real student charts page with more logic
            res.render("teacherStudentView",
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
                    Title: "Student Dashboard View",
                    activeSection: "Student_Analysis",
                    ClassCode: this.classToken,
                    studentEmail: req.session.studentEmail,
                    userEmail: userEmail
                });

        })
    });


    //TODO: CODY (Drilldown) make sure we keep the side bar the teacher version
};

exports.renderCategoryView = function (req, res) {

    //Render the teacher dashboard, but only focus on the category


    var userId = req.user._id.toString();


    var chartData;
    var tstudentsList;
    var questionList;

    async.waterfall([

        function (callback) {
            //Get the teachers students scores/masteries

            teacherFunctions.getStudentsMasterys(userId, function (scores) {

                callback(null, scores)
            })
        },
        function (scores, callback) {
            //Convert the scores into a format the front end can consume
            chartData = dataToChartHelper.createStudentMasteryChart(scores);
            callback(null)
        },
        function (callback) {

            //find the teachers class token
            teacherFunctions.getTeacherClassToken(userId, function (err, classToken) {
                callback(null, classToken)
            })
        },
        function (classToken, callback) {

            //create the list of the students in the class and provide the mastery of the category
            teacherFunctions.listStudentsAndCategoryMastery(classToken, req.session.category, function (err, students) {
                tstudentsList = students;
                callback(null)
            })
        },
        function (callback) {

            //create the list of missed questions
            teacherFunctions.getMissedQuestionsListPerCategory(userId, req.session.category, function (err, questions) {
                questionList = questions;
                callback(null);
            })
        }
    ], function () {
        //Send all the data to the front end.

        //TODO:CODY (Drilldown) you will need to switch up the main chart with the category that has been selected
        res.render("teacher", {
            totalData: chartData.totalData,
            totalOptions: chartData.totalOptions,
            CUData: chartData.Constitutional_Underpinnings_Data,
            SectionOptions: chartData.sectionOptions,
            Civil_Rights_and_Liberties_Data: chartData.Civil_Rights_and_Liberties_Data,
            Political_Beliefs_and_Behaviors_Data: chartData.Political_Beliefs_and_Behaviors_Data,
            Linkage_Institutions_Data: chartData.Linkage_Institutions_Data,
            Institutions_of_National_Government_Data: chartData.Institutions_of_National_Government_Data,
            Public_Policy_Data: chartData.Public_Policy_Data,
            studentsList: tstudentsList,
            questions: questionList,
            Title: "Teacher Dashboard",
            ClassCode: this.classToken,
            Category: req.session.category,
            userEmail: userEmail,
            activeSection: "Main_View"
        });
    });
};

exports.renderQuestionView = function (req, res) {

    //Render the question page

    DBFunctions.getQuestionData(req.session.passport.user, req.session.questionID, function (err, questionData) {

        res.render("questionResponsesView", {
            question: questionData,

            //TODO: Make real data
            activeSection: "Question_Analysis",
            Title: "Question Responses",
            ClassCode: this.classToken,
            userEmail: userEmail
        });

    })

};

/**
 * This method handles the question Analysis routing.
 * @param req
 * @param res
 */
exports.renderQuestionAnalysis = function (req, res) {

    //Get the users logged in id
    var userId = req.user._id.toString();

    DBFunctions.isNewUser(userId, function (err, userStatus) {
        if (userStatus) {
            //render new user page
            //teacher.renderNewTeacher(req, res);
            teacher.renderTeacherDashboard(req, res);
        }
        else {

            teacherFunctions.getMissedQuestionsList(userId, function (err, questions) {

                //render teacher page
                res.render("questionAnalysis", {
                    questions: questions,
                    activeSection: "Question_Analysis",
                    Title: "Question Analysis",
                    ClassCode: this.classToken,
                    userEmail: userEmail
                })
            })

        }
    });

};


/**
 *
 * @param req
 * @param res
 */
exports.teacherPage = function (req, res) {
    //redundent
    teacher.emptyOutSessionData(req);

    //Get the users logged in id
   var userId = req.user._id.toString();

    DBFunctions.getUserEmail(req.user._id.toString(), function (err, FoundTeacherEmail) {
        setUserEmail(FoundTeacherEmail);
    });

    DBFunctions.isNewUser(userId, function (err, userStatus) {
        if (userStatus) {
            //render new user page
            //teacher.renderNewTeacher(req, res);
            teacher.renderNewTeacher(req, res);
        }
        else {
            //render teacher page
            teacher.renderTeacherDashboard(req, res);
        }
    });
};

/**
 * This method is used to show a new teacher the help diagram
 * @param req
 * @param res
 */
exports.renderNewTeacher = function (req, res) {

    //TODO: Cody to create a new jade view that holds the jpg. The side nave header and footer should be the same
    //res.render();


    var userId = req.user._id.toString();


    DBFunctions.getUserEmail(userId, function (err, email) {
        //userEmail = email;


        teacherFunctions.getTeacherClassToken(userId, function (err, classToken) {
            this.classToken = classToken;
            res.render("newTeacher", {
                ClassCode: this.classToken,
                userEmail: userEmail,
                newTeacher: true,
                Title: "New Teacher Walkthrough",
                activeSection: "Main_View"
            })
        })

    })


};


exports.removeStudent = function (req, res) {
    //Get the student to remove

    var studentEmail = req.body.studentEmail;
    var userId = req.user._id.toString();


    teacherFunctions.removeStudentFromClass(userId, studentEmail, function (err, worked) {

        //res.redirect()

        //teacher.renderStudentList(req, res);

        //find the teachers class token
        teacherFunctions.getTeacherClassToken(userId, function (err, classToken) {

            teacherFunctions.listStudents(classToken, function (err, studentsList) {
                teacher.teacherPage(req, res);

                //res.render("studentList", {students: studentsList});
            });

        });


    })

};

/**
 * This method is used to show a teacher their dashboard.
 * @param req
 * @param res
 */
exports.renderTeacherDashboard = function (req, res) {
    //Get the users logged in id

    var userId = req.user._id.toString();


    var chartData = null;

    var tstudentsList = null;

    var questionList = null;


    var cacheData = null;


    async.waterfall([
        function (callback) {


            cacheFunction.getTeacherData(userId, function(err, foundData){
                cacheData = foundData;
                callback()
            })



            // //Get the teachers students scores/masteries
            // perfs.start('getStudentsMasteries');
            // teacherFunctions.getStudentsMasterys(userId, function (scores) {
            //     perfs.end('getStudentsMasteries');
            //     perfs.logToConsole();
            //     callback(null, scores)
            // })
        },
        
        
        
        
        // function (scores, callback) {
        //     //Convert the scores into a format the front end can consume
        //     perfs.start('dataToChartHelper');
        //     chartData = dataToChartHelper.createStudentMasteryChart(scores);
        //     perfs.end('dataToChartHelper');
        //     perfs.logToConsole();
        //     callback(null)
        // },
        function (callback) {

            //find the teachers class token
            perfs.start('getTeacherClassToken');
            teacherFunctions.getTeacherClassToken(userId, function (err, classToken) {
                this.classToken = classToken;
                perfs.end('getTeacherClassToken');
                perfs.logToConsole();
                callback()
            })
        }
        // function (classToken, callback) {
        //
        //     perfs.start('listStudents');
        //     //create the list of the students in the class
        //     teacherFunctions.listStudents(classToken, function (err, students) {
        //         tstudentsList = students;
        //         perfs.end('listStudents');
        //         perfs.logToConsole();
        //         callback(null)
        //     })
        // },
        // function (callback) {
        //
        //     perfs.start('getMissedQuestionsList');
        //     //create the list of missed questions
        //     teacherFunctions.getMissedQuestionsList(userId, function (err, questions) {
        //         questionList = questions;
        //         perfs.end('getMissedQuestionsList');
        //         perfs.logToConsole();
        //         callback(null);
        //     })
        // }
    ], function () {


        res.render("teacher",
            {
                totalData: JSON.parse(cacheData.chartData).totalData,
                totalOptions: JSON.parse(cacheData.chartData).totalOptions,
                CUData: JSON.parse(cacheData.chartData).Constitutional_Underpinnings_Data,
                SectionOptions: JSON.parse(cacheData.chartData).sectionOptions,
                Civil_Rights_and_Liberties_Data: JSON.parse(cacheData.chartData).Civil_Rights_and_Liberties_Data,
                Political_Beliefs_and_Behaviors_Data: JSON.parse(cacheData.chartData).Political_Beliefs_and_Behaviors_Data,
                Linkage_Institutions_Data: JSON.parse(cacheData.chartData).Linkage_Institutions_Data,
                Institutions_of_National_Government_Data: JSON.parse(cacheData.chartData).Institutions_of_National_Government_Data,
                Public_Policy_Data: JSON.parse(cacheData.chartData).Public_Policy_Data,
                studentsList: JSON.parse(cacheData.studentsList),
                questions: JSON.parse(cacheData.questionList),
                Title: "Teacher Dashboard",
                ClassCode: this.classToken,
                Category: req.session.category,
                userEmail: userEmail,
                activeSection: "Main_View",
                newTeacher: null
            });
        

        //Send all the data to the front end.
        // res.render("teacher",
        //     {
        //         totalData: chartData.totalData,
        //         totalOptions: chartData.totalOptions,
        //         CUData: chartData.Constitutional_Underpinnings_Data,
        //         SectionOptions: chartData.sectionOptions,
        //         Civil_Rights_and_Liberties_Data: chartData.Civil_Rights_and_Liberties_Data,
        //         Political_Beliefs_and_Behaviors_Data: chartData.Political_Beliefs_and_Behaviors_Data,
        //         Linkage_Institutions_Data: chartData.Linkage_Institutions_Data,
        //         Institutions_of_National_Government_Data: chartData.Institutions_of_National_Government_Data,
        //         Public_Policy_Data: chartData.Public_Policy_Data,
        //         studentsList: tstudentsList,
        //         questions: questionList,
        //         Title: "Teacher Dashboard",
        //         ClassCode: this.classToken,
        //         Category: req.session.category,
        //         userEmail: userEmail,
        //         activeSection: "Main_View",
        //         newTeacher: null
        //     });
    });
};



