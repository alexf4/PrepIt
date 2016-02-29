/**
 * Created by beckyedithbrooker on 7/18/15.
 */
var questionModel = require("../models/question");
var category = require("../models/category");
var userModel = require("../models/user");
var mongoose = require('mongoose');
var arrays = require("collections/shim-array");
var teacherFunctions = require("./teacherFunctions");
var freePlayLogic = require("../GameLogic/FreePlayLogic");

var questionFunctions = require("../DBWork/questionFunctions");

var async = require('async');


exports.createQuestionsForAllUsers = function (baseQuestionID, callback) {

    questionModel.findById(baseQuestionID, function (err, question) {
        if (err) throw err;

        //save the question
        foundQuestion = question;

        //Get a list of all users
        // get all the users
        userModel.find({}, function (err, users) {
            if (err) throw err;

            // object of all the users
            //console.log(users);

            async.forEachOf(users, function (user, key, sCallback) {
                    //Create new question
                    var userQuestion = new questionModel(foundQuestion);
                    userQuestion._id = mongoose.Types.ObjectId().toString();

                    userQuestion.baseQuestionID = baseQuestionID;

                    userQuestion.userID = user._id.toString();

                    userQuestion.save(function (err, data) {
                        if (err) {
                            sCallback(err, null);
                        }
                        sCallback(null, data);
                    })
                },
                function (err) {
                    if (err) {
                        callback(err, null)
                    }
                    callback(null, "worked");
                });

        });


    });
}


exports.addQuestionsToUser = function (inputID, callback) {

    //Find the new user
    userModel.findById(inputID, function (err, user) {

        if (err) throw err;

        questionModel.find({baseQuestionID: ""}, function (err, questionsList) {
            async.forEachOf(questionsList, function (question, key, sCallback) {

                    newQuestion = new questionModel(question);
                    newQuestion._id = mongoose.Types.ObjectId().toString();
                    newQuestion.baseQuestionID = question._id;
                    newQuestion.userID = inputID;

                    newQuestion.save(function (err, data) {
                        //newQuestion = null;


                        sCallback(null);
                    })
                },
                function (err) {
                    callback();
                });
        })
    })
}


/**
 * This method will get all the question Categories
 * We had to do it this way because we cant get queires back from the category schema, those methods only
 * pertain to data in one single instace of a category.
 * @param callback The method that is called when this operation is complete.
 */
exports.getCategoryTitles = function (callback) {
    var returnArray = arrays();

    category.find({}, {'Title': 1, '_id': 0}, function (err, categories) {
        if (err) {
            callback(err, null);
        }

        categories.forEach(function (entry) {
            returnArray.push(entry.Title);
        });

        callback(null, returnArray);

    });
};

/**
 * This method will grab the n most missed questions from the users account.
 * @param inputID the users id
 * @param numberOfQuestions the number of questions to
 * @param routeCallback the call back function
 */
exports.findNMissedQuestions = function (inputID, numberOfQuestions, callback) {

    userModel.findById(inputID, function (err, user) {
        if (err) {
            callback(err, null);
        }

        questionFunctions.findQuestionsForUser(inputID, function (err, questions) {
            if (err) {
                callback(err, null);
            }

            //Sort the question array with our specific compare function
            questions.sort(compare);
            callback(null, questions.slice(0, numberOfQuestions - 1));

        })
    })

};


/**
 * This method will return the top missed questions in a category
 * @param inputID the user to find
 * @param numberOfQuestions the number of questions to return
 * @param Category the category to return
 * @param callback the method that is called
 */
exports.getMissedQuestionsPerCategory = function (inputID, numberOfQuestions, inputCategory, callback) {

    var retArray = new arrays();

    userModel.findById(userId, function (err, user) {
        if (err) {
            callback(err, null);
        }


        questionFunctions.findQuestionsForUser(inputID, function (err, questions) {
            if (err) {
                callback(err, null);
            }


            //Sort the question array with our specific compare function
            questions.sort(compare);

            questions.forEach(function (entry) {
                if (entry.category == inputCategory) {
                    retArray.add(entry);
                }
            });

            callback(null, retArray.slice(0, numberOfQuestions - 1));

        })

    });
}

/**
 * Simple sort function. This proves that we need to move questions out of the user objects
 * @param a
 * @param b
 * @returns {number}
 */
function compare(a, b) {
    if (a.incorrectAttempts < b.incorrectAttempts)
        return -1;
    if (a.incorrectAttempts > b.incorrectAttempts)
        return 1;
    return 0;
}

/**
 * This method will return all of the questions in the db category
 * @param callback the method to be called when its done
 */
exports.getAllQuestions = function (callback) {

    questionModel.find({baseQuestionID: ""}, function (err, questionsList) {
        if (err) {
            callback(err, null);
        }
        return questionsList;
    });

};

/**
 * This method will return all of the questions of a user
 * @param inputID the ID of a user
 * @param callback the method to be called when its done
 */
exports.getAllQuestionsPerUser = function (inputID, callback) {
    userModel.findById(inputID, function (err, user) {
        if (err) {
            callback(err, null);
        }
        return user.questions;
    });
};

/**
 * This method will return the number of questions in a category
 * @param category the category that is searched for
 * @param callback the method that is called
 * @returns {number}
 */
exports.getNumberOfQuestionsPerCategory = function (inputCategory, callback) {
    questionModel.find({baseQuestionID: "", category: inputCategory}, function (err, questions) {
        if (err) {
            callback(err, null);
        }

        callback(err, questions.length);
    })
}

/**
 * This method will take a scores object and return the highest comprehension
 * @param scores
 */
exports.calculateComprehension = function (scores) {

    var comprehension = {
        comp: "",
        value: 0
    };

    if (scores.intermediate > scores.mastered && scores.intermediate > scores.novice) {
        comprehension.comp = "Intermediate";
        comprehension.value = scores.intermediate;

    }
    else if (scores.mastered > scores.intermediate && scores.mastered > scores.novice) {

        comprehension.comp = "Mastered";
        comprehension.value = scores.mastered;


    } else {
        comprehension.comp = "Novice";
        comprehension.value = scores.novice;
    }


    return comprehension;
};

/**
 * This method will return the question data of an user
 * @param inputID the user, could be a teacher or student
 * @param questionText the string format of the question
 * @param callback the simple callback.
 */
exports.getQuestionData = function (inputID, questionID, callback) {
    var found = false;


    questionFunctions.findQuestionsForUser(inputID, function (err, questions) {
        if (err) {
            callback(err, null);
        }

        questions.forEach(function (entry) {
            if (entry.baseQuestionID == questionID) {
                found = true;
                callback(null, entry);
            }
        });

        if (!found) {
            callback("could not find question", null);
        }
    })


    ////find the user
    //userModel.findById(inputID, function (err, user) {
    //    if (err) {
    //        callback(err, null);
    //    }
    //
    //
    //    user.questions.forEach(function (entry) {
    //        if (entry.baseQuestionID == questionID) {
    //            found = true;
    //            callback(null, entry);
    //        }
    //    });
    //
    //    if (!found) {
    //        callback("could not find question", null);
    //    }
    //});

};

/**
 * This method will determine if the user has not added a students, or has not answered any questions
 * @param inputID the users ID
 * @param callback the generic callback function
 */
exports.isNewUser = function (inputID, callback) {

    userModel.findById(inputID, function (err, user) {
        if (err) {
            callback(err, null);
        }

        if (user.isteacher) {
            teacherFunctions.listStudents(user.classToken, function (err, numberberOfStudents) {
                if (numberberOfStudents.length > 0) {
                    callback(null, false);
                }
                else {
                    callback(null, true);
                }
            })

        }

        else {//user is a student

            var questionAttempted = false;


            questionFunctions.findQuestionsForUser(inputID, function (err, questions) {
                if (err) {
                    callback(err, null);
                }

                questions.forEach(function (entry) {

                    if (entry.numberOfAttempts > 0) {
                        questionAttempted = true;
                    }
                });

                callback(null, !questionAttempted);

            })

            ////Find all the questions from a specific category
            //user.questions.forEach(function (entry) {
            //
            //    if (entry.numberOfAttempts > 0) {
            //        questionAttempted = true;
            //    }
            //});
            //
            //callback(null, !questionAttempted);

        }


    });

};

/**
 * Util function
 * @param baseQuestionId
 * @param callback
 */
exports.removeQuestion = function (baseQuestionId, callback) {
    userModel.find({}, function (err, users) {
        if (err) throw err;

        // object of all the users
        //console.log(users);

        //For each user add a new question that is a copy of the question, but has a new id
        users.forEach(function (user) {

            for (var i = user.questions.length; i--;) {
                if (user.questions[i].baseQuestionID === baseQuestionId) {
                    arr.splice(i, 1);
                }
            }

            //user.questions.forEach(function(entry){
            //
            //    if(entry.baseQuestionID == baseQuestionId){
            //        //questionAttempted = true;
            //
            //        user.questions.
            //    }
            //
            //});

            //
            ////Create new question
            //var userQuestion = new questionModel(foundQuestion);
            //userQuestion._id = mongoose.Types.ObjectId().toString();

            //user.questions

            //Add that question to that users question set
            //user.questions.push(userQuestion);

            user.save(function (error, data) {
            });

        });

    });

    callback()
};

/**
 * This is just a util function
 * @param ClassToken
 * @param callback
 */
exports.updateTeachersQuestions = function (ClassToken, callback) {
    //find all the students
    userModel.find({classToken: ClassToken, $and: [{"isteacher": false}]}, function (err, users) {
        if (err) {
            callback();
        }

        //for each user
        users.forEach(function (user) {

            //for each question
            user.questions.forEach(function (entry) {

                var as = entry.responses.a;

                for (var i = 0; i < as; i++) {
                    freePlayLogic.updateTeacherData(ClassToken, entry.baseQuestionID, "a");
                }


                var bs = entry.responses.b;
                for (var i = 0; i < bs; i++) {
                    freePlayLogic.updateTeacherData(ClassToken, entry.baseQuestionID, "b");
                }

                var cs = entry.responses.c;
                for (var i = 0; i < cs; i++) {
                    freePlayLogic.updateTeacherData(ClassToken, entry.baseQuestionID, "c");
                }

                var ds = entry.responses.d;
                for (var i = 0; i < ds; i++) {
                    freePlayLogic.updateTeacherData(ClassToken, entry.baseQuestionID, "d");
                }
            });

        });

    });

    callback();
};

exports.getUserEmail = function (inputID, callback) {
    userModel.findById(inputID, function (err, user) {
        if (err) {
            callback(err, null);
        }

        callback(null, user.email);
    });
};


/**
 * This function will return all the questions of a user
 * @param inputID
 * @param callback
 */
//exports.findQuestionsForUser = function (inputID, callback) {
//
//    questionModel.find({userID: inputID}, function (err, foundQuestions) {
//        if (err) {
//            callback(err, null);
//        }
//
//        callback(null, foundQuestions);
//    })
//
//}

/**
 * This method update the category count
 * @param category
 * @param callback
 */
exports.updateCategoryCount = function (inputCategory, callback) {
    category.find({Title: inputCategory}, function (err, cat) {


        if (err) {
            callback(err, null)
        }
        cat[0].questionCount++;
        cat[0].save(function (err, product) {
            if (err) throw err;
            callback(null, "worked");

        });
    })
}

/**
 * This is just a util script, it should not be called during app usage.
 * @param callback
 */
exports.generateQuestionsForUsers = function (callback) {
    userModel.find({}, function (err, users) {
        if (err) {
            callback(err, null);
        }


        async.forEachOf(users, function (user, key, sCallback) {
                //console.log("got here");

                user.questions.forEach(function (question) {
                    //create new question object
                    var newQuestion = questionModel();


                    newQuestion.category = question.category;

                    newQuestion.subcategory = question.subcategory;

                    newQuestion.questionText = question.questionText;

                    newQuestion.answers = question.answers;

                    newQuestion.solution = question.solution;

                    newQuestion.correct = question.correct;

                    newQuestion.comprehension = question.comprehension;

                    newQuestion.responses = question.responses;

                    newQuestion.numberOfAttempts = question.numberOfAttempts;
                    newQuestion.incorrectAttempts = question.incorrectAttempts;
                    newQuestion.correctAttempts = question.correctAttempts;

                    newQuestion.baseQuestionID = question.baseQuestionID;


                    //update the userid of the question
                    newQuestion.userID = user._id.toString();

                    newQuestion.save(function (err, product) {
                        if (err) throw err;

                        sCallback();


                    });

                })


            },
            function (err) {
                callback();
            })
    });
}