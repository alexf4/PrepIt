/**
 * Created by alexf4 on 11/27/15.
 */

var questionModel = require("../models/question");
var categoryModel = require("../models/category");
var category = require("../models/category");
var userModel = require("../models/user");
var mongoose = require('mongoose');
var async = require('async');
var Dict = require("collections/dict");
var studentFunctions = require("./studentFunctions");
var teacherFunctions = require("./teacherFunctions");
var DBFunctions = require("../DBWork/DBFunctions.js");

var list = require("collections/list");
/**
 * This method will update the token element of the teacher
 * @param inputID the teacher to updated
 * @param updatedLink the new string for the "token" element
 * @param callback the function that should be called when this has been updated.
 */
exports.updateTeacherLink = function (inputID, updatedLink, callback){
    userModel.findById(userId , function (err, user){

        user.token = newlink;

        user.save(function (err , user) {
            callback();
        })
    });
};

/**
 * This method will return the average mastery for a specific question
 * @param inputID the teachers ID
 * @param questionid the basequestionID to look up
 * @param routeCallback the callback.
 */
exports.getClassAverageMasteryForQuestion = function (inputID , questionid, routeCallback){

    var scores = {
        mastered : 0,
        intermediate : 0,
        novice : 0
    };

    var inputClassToken;

    //Find the users token
    async.waterfall([
        function(callback) {
            userModel.findById(inputID, function(err, user) {
                if (err){
                    callback(err, null);
                }

                inputClassToken = user.token;

                callback(null, user);

            });
        },

        // find all students that have the same teacher token
        function( user, callback) {

            userModel.find({ classToken: user.token , $and: [ { "isteacher": false } ] }, function (err, users){
                if (err){
                    callback(err, null);
                }
                callback(null, users);
            });
        }
    ], function (err, users) {

        //For each student in the teachers class, get the mastery of the question
        async.forEachOf(users , function (student, key, callback) {

            if (!student.isTeacher) {


                studentFunctions.getMasteryOfQuestion(student._id.toString(), questionid, function (err, comp) {
                    //merge all the scores

                    switch (comp) {
                        case "mastered":
                            scores.mastered++;
                            break;
                        case "intermediate":
                            scores.intermediate++;
                            break;
                        case "novice":
                            scores.novice++;
                            break;
                    }

                    callback();
                })
            }


        }, function(err){



            //Get the number of students
            teacherFunctions.numberOfStudentsInClass(inputClassToken, function(err, students){
                scores.mastered  = Math.floor(scores.mastered / students *100);
                scores.intermediate  = Math.floor(scores.intermediate / students *100);
                scores.novice  = Math.floor(scores.novice / students *100);

                routeCallback(null, scores);
            })

        })

    });
};

/**
 * This method will return the class average master of a given category
 * @param inputID the userid
 * @param category the category to check
 */
exports.getClassAverageMasteryForCategory = function (inputID , category , routeCallback){


    var scores = {
        mastered : 0,
        intermediate : 0,
        novice : 0
    };

    var inputClassToken;

    var numberOfStudents;

    //Find the users token
    async.waterfall([
        function(callback) {
            userModel.findById(inputID, function(err, user) {
                if (err){
                    callback(err, null);
                }
                inputClassToken = user.token;

                callback(null, user);
                
            });
        },

        function (user, callback){
            teacherFunctions.numberOfStudentsInClass(inputClassToken, function(err, students){
                numberOfStudents = students;
                callback(null,user);
            })
        },

        // find all students that have the same teacher token
        function( user, callback) {

            userModel.find({ classToken: user.token , $and: [ { "isteacher": false } ]  }, function (err, users){
                if (err){
                    callback(err, null);
                }
                callback(null, users);
            });
        }
    ], function (err, users) {


        async.forEachOf(users , function (student, key, callback){

            if(!student.isTeacher) {

                studentFunctions.getMasterOfCategoryInts(student._id.toString(), category, function (err, retScores) {

                    scores.mastered = scores.mastered + retScores.mastered;
                    scores.intermediate = scores.intermediate + retScores.intermediate;
                    scores.novice = scores.novice + retScores.novice;

                    callback();
                })
            }


        }, function(err){

                DBFunctions.getNumberOfQuestionsPerCategory(category, function(err, questionCount){
                    var totalQuestionsAsked = questionCount * numberOfStudents;
                    scores.mastered  = Math.floor(scores.mastered /totalQuestionsAsked *100);
                    scores.intermediate  = Math.floor(scores.intermediate /totalQuestionsAsked *100);
                    scores.novice  = Math.floor(scores.novice/ totalQuestionsAsked *100);

                    routeCallback(null, scores);
                }
            );
        })

    });
};


/**
 * This method will get all the scores of the students that are linked to this user
 * @param inputID the teachers id
 * @param routeCallback the function that is called back when this is ready
 */
exports.getStudentsScores = function (inputID, routeCallback){


    var retDict = new Dict;

    //Find the users token
    async.waterfall([
        function(callback) {
            userModel.findById(inputID, function(err, user) {
                if (err){
                    callback(err, null);
                }
                callback(null, user);

            });
        },
        function (user, callback){
            categoryModel.find({}, function (err, categories){
                if (err){
                    callback(err, null);
                }

                //Setup dictionary
                categories.forEach(function (entry){
                    var questionData = {
                        questions : 0,
                        correct : 0,
                        testPercent : entry.TestPercent
                    };

                    retDict.set(entry.Title , questionData);
                });

                //ser the total number of questions
                retDict.set("totalQuestions" , 0);

                retDict.set("totalCorrect" , 0);

                callback(null, user);

            });
        },
        function( user, callback) {
            // find all students that have the same teacher token
            userModel.find({ classToken: user.token , $and: [ { "isteacher": false } ]  }, function (err, users){
                if (err){
                    callback(err, null);
                }
                callback(null, users);
            });
        }
    ], function (err, users) {

        //Count how many students the teacher has

        var numStudents = users.length;


        async.forEachOf(users , function (value, key, callback){

            studentFunctions.getUserScores(value._id.toString(), function(scores){
                //merge all the scores


                teacherFunctions.addStudentScoresToTotal(numStudents , retDict , scores);

                //scores.forEach( function (entry){
                //    console.log("here2");
                //})

                callback();


            })


        }, function(err){

            //return the scores with callback(scores);
            routeCallback(retDict);
        })

    });

};

/**
 * This method will compile the students data into one source
 * @param numStudents the total number of students
 * @param totalScores the total scores dictionary
 * @param studentScore the new student score to be added
 */
exports.addStudentScoresToTotal = function ( numStudents, totalScores, studentScore){

    //Create an array of each key
    keys = totalScores.keys();

    tempValue = null;

    //get values for each key
    keys.forEach(function (entry){
        if (entry == "totalCorrect") {
            tempValue = studentScore.get("totalCorrect") / numStudents;

            tempValue = tempValue + totalScores.get(entry);


            //  totalScores.set(entry , tempValue);

        }else if (entry == "totalQuestions"){
            tempValue = studentScore.get("totalQuestions") / numStudents;

            tempValue = tempValue + totalScores.get(entry);

            // totalScores.set(entry , tempValue);

        }else{

            var sectionScore = studentScore.get(entry);
            var runningTotalScore = totalScores.get(entry);

            tempValue = {
                questions : (sectionScore.questions / numStudents) + runningTotalScore.questions,
                correct : (sectionScore.correct /numStudents) + runningTotalScore.correct,
                testPercent : (sectionScore.testPercent /numStudents) + runningTotalScore.testPercent
            }

        }

        totalScores.set(entry , tempValue);

    })

};

/**
 * This method will count all the students in a class
 * @param teacherToken the class
 */
exports.numberOfStudentsInClass = function (teacherToken, callback){
    // find all students that have the same teacher token
    userModel.find({ classToken: teacherToken , $and: [ { "isteacher": false } ] }, function (err, users){
        if (err){
            callback(err, null);
        }


        callback(null, users.length);
    });
};


/**
 * This method will get all the scores of the students that are linked to this user
 * @param inputID the teachers id
 * @param routeCallback the function that is called back when this is ready
 */
exports.getStudentsMasterys = function (inputID, routeCallback){


    var retDict = new Dict;

    //Find the users token
    async.waterfall([
        function(callback) {
            userModel.findById(inputID, function(err, user) {
                if (err){
                    callback(err, null);
                }
                callback(null, user);

            });
        },
        function (user, callback){
            categoryModel.find({}, function (err, categories){
                if (err){
                    callback(err, null);
                }

                //Setup dictionary
                categories.forEach(function (entry){
                    var questionData = {
                        mastered : 0,
                        intermediate : 0,
                        novice : 0,
                        testPercent : entry.TestPercent
                    };

                    retDict.set(entry.Title , questionData);
                });


                //ser the total number of questions
                retDict.set("TotalMastery" , 0);

                retDict.set("TotalIntermediate" , 0);

                retDict.set("TotalNovice" , 0);

                callback(null, user);

            });
        },
        function( user, callback) {
            // find all students that have the same teacher token
            userModel.find({ classToken: user.token , $and: [ { "isteacher": false } ]  }, function (err, users){
                if (err){
                    callback(err, null);
                }
                callback(null, users);
            });
        }
    ], function (err, users) {

        //Count how many students the teacher has

        var numStudents = users.length;


        async.forEachOf(users , function (value, key, callback){

            studentFunctions.getMasteryScores(value._id.toString(), function(scores){
                //merge all the scores

                teacherFunctions.addStudentMasteryToTotal(numStudents , retDict , scores);

                callback();


            })


        }, function(err){


            //return the scores with callback(scores);
            routeCallback(retDict);
        })

    });

};

exports.getMissedQuestionsList = function (teacherID, routeCallback){

    var retList = new list;

    //grab all the questions from the teacher object
    userModel.findById(teacherID, function(err, user) {
        if (err){
            routeCallback(err, null);
        }

        //Sort the questions
        user.questions.sort(compare);

        //for each question create a new object then add it to the return list
        user.questions.forEach(function (entry){


            var questionData = {
                questionString : entry.questionText,
                questionMissed : entry.incorrectAttempts,
                questionID     : entry.baseQuestionID
            };

            if(entry.comprehension.mastered){
                questionData.questionMastered = "Mastered";

            }
            else if (entry.comprehension.intermediate){
                questionData.questionMastered = "Intermediate";
            }
            else {
                questionData.questionMastered = "Novice";

            }

            retList.add(questionData);


        });


        routeCallback(null, retList.toJSON());

    });

};

exports.getMissedQuestionsListPerCategory = function(inputTeacherID, category, routeCallback){
    var retList = new list;

    //grab all the questions from the teacher object
    userModel.findById(inputTeacherID, function(err, user) {
        if (err){
            routeCallback(err, null);
        }

        //Sort the questions
        user.questions.sort(compare);

        //for each question create a new object then add it to the return list
        user.questions.forEach(function (entry){

            if (entry.category == category) {
                var questionData = {
                    questionString: entry.questionText,
                    questionMissed: entry.incorrectAttempts
                };

                if (entry.comprehension.mastered) {
                    questionData.questionMastered = "Mastered";

                }
                else if (entry.comprehension.intermediate) {
                    questionData.questionMastered = "Intermediate";
                }
                else {
                    questionData.questionMastered = "Novice";

                }

                retList.add(questionData);

            }
        });


        routeCallback(null, retList.toJSON());

    });
};


/**
 * Simple sort function. This proves that we need to move questions out of the user objects
 * @param a
 * @param b
 * @returns {number}
 */
function compare(a, b) {
    if (a.incorrectAttempts < b.incorrectAttempts)
        return 1;
    if (a.incorrectAttempts > b.incorrectAttempts)
        return -1;
    return 0;
}

exports.listStudents = function (inputClassToken, routeCallback){

    var retList = new list;



    //find all the students of the class
    userModel.find({ classToken: inputClassToken , $and: [ { "isteacher": false } ]  }, function (err, users){
        if (err){
            routeCallback(err, null);
        }

        async.forEachOf(users , function (value, key, callback){

            var studentObject = {};

            studentObject.email = value.email;

            studentFunctions.getMasteryScores(value._id.toString(), function(scores){

                studentObject.totalMastery = Math.round(scores.get("TotalMastery"));


                retList.add(studentObject);

                callback();

            })

        }, function(err){


            //return the scores with callback(scores);
            routeCallback(err, retList.toJSON());
        })

    });

    //add each students email and total mastery to the ret dict

};


exports.getTeacherClassToken = function (inputID , callback ){
    userModel.findById(inputID, function(err, user) {
        if (err){
            callback(err, null);
        }
        callback(null, user.classToken);

    });
};



/**
 * This method will compile the students data into one source
 * @param numStudents the total number of students
 * @param totalScores the total scores dictionary
 * @param studentScore the new student score to be added
 */
exports.addStudentMasteryToTotal = function ( numStudents, totalScores, studentScore){

    //Create an array of each key
    keys = totalScores.keys();

    tempValue = null;

    //get values for each key
    keys.forEach(function (entry){

       if (entry == "TotalMastery"){
            tempValue = studentScore.get("TotalMastery") / numStudents;

            tempValue = tempValue + totalScores.get(entry);

             totalScores.set(entry , tempValue);

        }else if (entry == "TotalIntermediate"){
            tempValue = studentScore.get("TotalIntermediate") / numStudents;

            tempValue = tempValue + totalScores.get(entry);

             totalScores.set(entry , tempValue);


        }else if (entry == "TotalNovice"){
            tempValue = studentScore.get("TotalNovice") / numStudents;

            tempValue = tempValue + totalScores.get(entry);

            totalScores.set(entry , tempValue);

        }else {
            var sectionScore = studentScore.get(entry);
            var runningTotalScore = totalScores.get(entry);

            var scores = {
                mastered: (sectionScore.mastered / numStudents ) + runningTotalScore.mastered,
                intermediate: (sectionScore.intermediate / numStudents ) + runningTotalScore.intermediate,
                novice: (sectionScore.novice / numStudents ) + runningTotalScore.novice,
            };

            totalScores.set(entry, scores);
        }
    })

};

/**
 * This method will list all the students of a class plus provide the mastery of a specific category per student
 * @param classToken the class the students are in
 * @param category the category to get the mastery from
 * @param callback the callback
 */
exports.listStudentsAndCategoryMastery = function (classToken, category, routeCallback){
    var retList = new list;



    //find all the students of the class
    userModel.find({ classToken: classToken , $and: [ { "isteacher": false } ]  }, function (err, users){
        if (err){
            routeCallback(err, null);
        }

        async.forEachOf(users , function (value, key, callback){

            var studentObject = {};

            studentObject.email = value.email;

            studentFunctions.getMasterOfCategory(value._id.toString(),category, function(err, scores){

                //studentObject.totalMastery = scores.get("TotalMastery");

                //studentObject.totalMastery = DBFunctions.calculateComprehension(scores);

                studentObject.totalMastery = scores.mastered;
                retList.add(studentObject);

                callback();

            })

        }, function(err){


            //return the scores with callback(scores);
            routeCallback(null, retList.toJSON());
        })

    });
};




///**
// * This method will return all the question data in highest missed order of a teacher
// * @param classToken the teachers class
// * @param callback the callback
// */
//exports.getAllQuestionDataForTeacher = function (classToken, callback){
//
//};
//
//
///**
// * This method will return all of the question data for a teacher of a specific category
// * @param classToken the teachers class
// * @param category the category to get the mastery from
// * @param callback the callback
// */
//exports.getAllQuestionDataForTeacherOfCategory = function (classToken, category, callback){
//
//}

