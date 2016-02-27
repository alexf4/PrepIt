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
var list = require("collections/list");
var DBFunctions = require("../DBWork/DBFunctions.js");
var studentFunctions = require("./studentFunctions");



/**
 * This method updates the user items teacher token slot
 * @param inputID the students id
 * @param newlink the string input that will be the set as the teacher token element
 * @param callback the function to be called after the update is done in db
 */
exports.updateStudentLink = function(inputID, newlink ,callback) {
    userModel.findById(userId , function (err, user){

        user.classToken = newlink;

        user.save(function (err , user) {
            callback();
        })
    });
};

/**
 * This method removes the student teacher link and sets it to 0
 * @param inputID the students input id
 * @param callback the method to be called when its done.
 */
exports.removeStudentLink = function (inputID , callback){
    userModel.findById(inputID, function (err, user){
        if(err){
            callback(err, null);
        }

        user.classToken = 0;

        user.save(function (err, user){
            callback();
        })
    })
}

/**
 * This method will return the scores dictionary for this student
 * @param inputID the id of the student
 * @param callback the function to be called when the data is ready.
 */
exports.getUserScores = function (inputID, callback) {

    var retDict = new Dict;

    var foundUser = null;

    async.parallel([
            function(callback){
                userModel.findById(inputID, function(err, user) {
                    if (err){
                        callback(err, null);
                    }
                    callback(null, user);

                });
            },
            function(callback){
                categoryModel.find({}, function (err, categories){
                    if (err){
                        callback(err, null);
                    }
                    callback(null, categories);

                });

            }
        ],
        // callback
        function(err, results){

            //Find how many questions there are
            foundUser = results[0];
            categories = results[1];


            categories.forEach(function(entry){

                var numberOfQuestionsPerCategory = foundUser.countNumberOfQuestionsPerCategory(entry.Title);
                var numberOfQuestionsCorrectPerCategory = foundUser.numberOfQuestionsCorrectPerCategory(entry.Title);


                var questionData = {
                    questions : numberOfQuestionsPerCategory,
                    correct : numberOfQuestionsCorrectPerCategory,
                    testPercent : entry.TestPercent
                };

                retDict.set(entry.Title , questionData);

            });

            //Add the total number of questions
            var totalQuestions = foundUser.questions.length;

            retDict.set("totalQuestions" , totalQuestions);

            var totalCorrectQuestions = foundUser.numberOfCorrectAnswersForUser();

            retDict.set("totalCorrect" , totalCorrectQuestions);

            callback(retDict);

        });
};

/**
 * This method will find the students teacher
 * @param teacherToken, the coresponding teacher token to check the tokens of all the users.
 * @param callback
 */
exports.getTeacher = function (classToken, callback) {
    userModel.find({ token :classToken }, function (err, teacher){
        if (err){
            callback(err, null);
        }
        callback(null, teacher);

    });
};

/**
 * This method will find the students teacher
 * @param teacherToken, the coresponding teacher token to check the tokens of all the users.
 * @param callback
 */
exports.getTeacherQuestion = function (classToken, inputBaseQuestionID, callback) {
    userModel.find({ token :classToken }, function (err, teacher){
        if (err){
            callback(err, null);
        }

        if(teacher[0].questions == null){
            console.log("error");
            console.log("CLass token :"+ classToken + " inputQuestion: " + inputBaseQuestionID);
            callback("teacher does not have questions", null);
        }

        teacher[0].questions.forEach(function(entry){
            if (entry.baseQuestionID == inputBaseQuestionID) {
                callback(null, entry._id.toString());
            }
        });
    });
};

/**
 * This method will return the mastery level of category for a student.
 * @param inputID the student id
 * @param category the category to search on
 * @param callback the method called back.
 */
exports.getMasterOfCategory = function (inputID, category , callback){
    userModel.findById(inputID , function (err, user){
        if (err){
            callback(err, null);
        }

        var scores = {
            mastered : 0,
            intermediate : 0,
            novice : 0
        }


        //Find all the questions from a specific category
        user.questions.forEach(function(entry){

            //For each question tally its comp score
            if (entry.category == category){
                if(entry.comprehension.mastered){
                    scores.mastered ++;
                }
                else if (entry.comprehension.intermediate){
                    scores.intermediate ++;
                }
                else if (entry.comprehension.novice) {
                    scores.novice ++;
                }
            }
        })

        //find out the number of questions in that category
        DBFunctions.getNumberOfQuestionsPerCategory(category, function(err, questionCount){
            scores.mastered  = Math.floor(scores.mastered / questionCount *100);
            scores.intermediate  = Math.floor(scores.intermediate / questionCount *100);
            scores.novice  = Math.floor(scores.novice / questionCount *100);

            callback(null, scores);
        });
    });
};

/**
 *
 * @param inputID
 * @param category
 * @param callback
 */
exports.getMasterOfCategoryInts = function (inputID, category , callback){
    userModel.findById(inputID , function (err, user){
        if (err){
            callback(err, null);
        }

        var scores = {
            mastered : 0,
            intermediate : 0,
            novice : 0
        }


        //Find all the questions from a specific category
        user.questions.forEach(function(entry){

            //For each question tally its comp score
            if (entry.category == category){
                if(entry.comprehension.mastered){
                    scores.mastered ++;
                }
                else if (entry.comprehension.intermediate){
                    scores.intermediate ++;
                }
                else if (entry.comprehension.novice) {
                    scores.novice ++;
                }
            }
        })

        callback(null, scores);


    });
};

/**
 * This method will return the mastery of a single question
 * @param inputID the users ID
 * @param questionID the base question ID
 * @param Callback the method to be called when its done.
 */
exports.getMasteryOfQuestion = function (inputID, questionID, callback){
    userModel.findById(inputID , function (err, user){
        if (err){
            callback(err, null);
        }

        //Find all the questions from a specific category
        user.questions.forEach(function(entry){

            //Find the question based on the input question id.
            if (entry.baseQuestionID == questionID){
                if(entry.comprehension.mastered){
                    callback (null, "mastered");
                }
                else if (entry.comprehension.intermediate){
                    callback (null, "intermediate");
                }
                else {
                    callback ( null, "novice");
                }
            }
        })

    });
};

exports.getMasteryScores = function (studentID , routeCallback ){
    var retDict = new Dict;

    var foundUser = null;

    var totalMastery = 0;

    var totalIntermediate = 0;

    var totalNovice = 0;

    async.parallel([
            function(callback){
                userModel.findById(studentID, function(err, user) {
                    if (err){
                        callback(err, null);
                    }
                    callback(null, user);

                });
            },
            function(callback){
                categoryModel.find({}, function (err, categories){
                    if (err){
                        callback(err, null);
                    }
                    callback(null, categories);

                });

            }
        ],
        // callback
        function(err, results){

            //Find how many questions there are
            foundUser = results[0];
            categories = results[1];


            async.forEachOf(categories, function(category, counter , callback){

                studentFunctions.getMasterOfCategoryInts(foundUser._id , category.Title, function (err, scores){
                    var  categoryData = {
                        mastered : scores.mastered,
                        intermediate : scores.intermediate,
                        novice : scores.novice,
                        testPercent : category.TestPercent
                    };

                    totalMastery += scores.mastered / category.questionCount * categoryData.testPercent;
                    totalIntermediate += scores.intermediate / category.questionCount  * categoryData.testPercent;
                    totalNovice += scores.novice / category.questionCount * categoryData.testPercent;

                    retDict.set(category.Title, categoryData);
                    callback();
                })
            }, function(err){


                retDict.set("TotalMastery", totalMastery);

                retDict.set("TotalIntermediate", totalIntermediate);

                retDict.set("TotalNovice", totalNovice);


                routeCallback(retDict);

            });
        });
};

/**
 * This method will return all of the question data for the student
 * @param studentID the studentd ID
 * @param callback the callback
 */
exports.getQuestionsForStudent = function(studentID, callback){

    var retList = new list;

    //grab all the questions from the teacher object
    userModel.findById(studentID, function(err, user) {
        if (err){
            callback(err, null);
        }

        //Sort the questions
        user.questions.sort(compare);

        //for each question create a new object then add it to the return list
        user.questions.forEach(function (entry){


            var questionData = {
                questionString : entry.questionText,
                questionMissed : entry.incorrectAttempts
            }

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


        })


        callback(null, retList.toJSON());

    });

};

/**
 * This method will return the students ID from an email
 * @param email the studetns email
 * @param callback the callback
 */
exports.getStudentFromEmail = function(inputEmail, callback){
    userModel.find({ email :inputEmail }, function (err, student){
        if (err){
            callback(err, null);
        }

        callback(null, student[0]._id.toString());
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