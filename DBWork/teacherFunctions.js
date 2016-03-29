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
var List = require("collections/list");
var studentFunctions = require("./studentFunctions");
var teacherFunctions = require("./teacherFunctions");
var DBFunctions = require("../DBWork/DBFunctions.js");
var questionFunctions = require("../DBWork/questionFunctions");
var freePlayLogic = require("../GameLogic/FreePlayLogic");

var list = require("collections/list");
/**
 * This method will update the token element of the teacher
 * @param inputID the teacher to updated
 * @param updatedLink the new string for the "token" element
 * @param callback the function that should be called when this has been updated.
 */
exports.updateTeacherLink = function (inputID, updatedLink, callback) {
    userModel.findById(userId, function (err, user) {

        user.token = newlink;

        user.save(function (err, user) {
            callback();
        })
    });
};


/**
 * This method removes a student from a class.
 * @param teacherId
 * @param studentEmail
 * @param callback
 */
exports.removeStudentFromClass = function (teacherId, studentEmail, callback) {

    var studentID;

    //find the student
    studentFunctions.getStudentFromEmail(studentEmail, function (err, student) {


        studentID = student;

        studentFunctions.removeStudentLink(studentID, function (err, worked) {


            teacherFunctions.removeOldStudentQuestionsFromTeacher(teacherId, studentID, function (err, worked) {

                callback(err, worked);
            })
        });


    });


};

/**
 * This method will remove an a students question data from the teachers question data.
 *
 * @param teacherid The teachers ID
 * @param studentID The student that is leaving the class.
 * @param callback
 */
exports.removeOldStudentQuestionsFromTeacher = function (teacherID, studentID, callback) {

    var studentQuestions;
    var studentQuestion;
    var teacherQuestions;
    var teacherQuestion;

    /**
     * This waterfall will:
     *      Find the students questions
     *      Find the teachers questions
     *          For each question in common remove the data from the teachers question
     */

    async.waterfall([
            /**
             * Find the students questions
             * @param wCallback
             */
                function (wCallback) {
                questionFunctions.findAnsweredQuestions(studentID, function (err, foundQuestions) {

                    studentQuestions = new List(foundQuestions);
                    wCallback();
                })
            },
            /**
             * Find the teachers questions
             * @param wCallback
             */
                function (wCallback) {
                questionFunctions.findQuestionsForUser(teacherID, function (err, foundQuestions) {
                    teacherQuestions = foundQuestions;
                    wCallback();
                })
            },

            /**
             * For each question in common, remove the data from teh teachers question.
             * @param wCallback
             */
                function (wCallback) {
                //For each item in the students questions
                async.eachSeries(studentQuestions.toArray(), function (iStudentQuestion, sSeries) {

                        //Set the students data
                        studentQuestion = iStudentQuestion;

                        //For each item in the teachers questions
                        async.eachSeries(teacherQuestions.toArray(), function (iTeacherQuestion, tSeries) {

                                //Set the teachers data
                                teacherQuestion = iTeacherQuestion;

                                //if the questions are the same remove the data
                                if (studentQuestion.baseQuestionID == teacherQuestion.baseQuestionID) {

                                    //In series, for each response remove the question data.
                                    async.series([
                                            function (seriesCallback) {
                                                if (studentQuestion.responses.a > 0) {
                                                    teacherFunctions.removeResponsesHelper(teacherID, "a", teacherQuestion, studentQuestion.responses.a, function (err, worked) {

                                                        seriesCallback(err, worked);
                                                    })
                                                } else {
                                                    seriesCallback(null, "notNeeded");
                                                }
                                            },
                                            function (seriesCallback) {
                                                if (studentQuestion.responses.b > 0) {
                                                    teacherFunctions.removeResponsesHelper(teacherID, "b", teacherQuestion, studentQuestion.responses.b, function (err, worked) {
                                                        seriesCallback(err, worked);
                                                    })
                                                } else {
                                                    seriesCallback(null, "notNeeded");
                                                }
                                            },
                                            function (seriesCallback) {
                                                if (studentQuestion.responses.c > 0) {
                                                    teacherFunctions.removeResponsesHelper(teacherID, "c", teacherQuestion, studentQuestion.responses.c, function (err, worked) {
                                                        seriesCallback(err, worked);
                                                    })
                                                } else {
                                                    seriesCallback(null, "notNeeded");
                                                }
                                            },
                                            function (seriesCallback) {
                                                if (studentQuestion.responses.d > 0) {
                                                    teacherFunctions.removeResponsesHelper(teacherID, "d", teacherQuestion, studentQuestion.responses.d, function (err, worked) {
                                                        seriesCallback(err, worked);
                                                    })
                                                } else {
                                                    seriesCallback(null, "notNeeded");
                                                }
                                            }
                                        ],
                                        /**
                                         * This question is done and we need to start on the next one.
                                         * @param err
                                         * @param results
                                         */
                                        function (err, results) {
                                            tSeries(err, "worked");
                                        }
                                    );
                                }
                                //There is no match for this questions.
                                else {
                                    tSeries(null, "worked");
                                }
                            },
                            /**
                             * The students question is done
                             * @param err
                             * @param result
                             */
                            function (err, result) {
                                sSeries(err, result);
                            })

                    },
                    /**
                     * This waterfall async program flow is done
                     */
                    function () {
                        wCallback();
                    })
            }
        ],
        /**
         * Call back out of this method.
         */
        function () {
            callback(null, "worked");
        }
    )
};

/**
 * This method will return the average mastery for a specific question
 * @param inputID the teachers ID
 * @param questionid the basequestionID to look up
 * @param routeCallback the callback.
 */
exports.getClassAverageMasteryForQuestion = function (inputID, questionid, routeCallback) {

    var scores = {
        mastered: 0,
        intermediate: 0,
        novice: 0
    };

    var inputClassToken;

    //Find the users token
    async.waterfall([
        function (callback) {
            userModel.findById(inputID, function (err, user) {
                if (err) {
                    callback(err, null);
                }

                inputClassToken = user.token;

                callback(null, user);

            });
        },

        // find all students that have the same teacher token
        function (user, callback) {

            userModel.find({classToken: user.token, $and: [{"isteacher": false}]}, function (err, users) {
                if (err) {
                    callback(err, null);
                }
                callback(null, users);
            });
        }
    ], function (err, users) {

        //For each student in the teachers class, get the mastery of the question
        async.forEachOf(users, function (student, key, callback) {

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


        }, function (err) {



            //Get the number of students
            teacherFunctions.numberOfStudentsInClass(inputClassToken, function (err, students) {
                scores.mastered = Math.floor(scores.mastered / students * 100);
                scores.intermediate = Math.floor(scores.intermediate / students * 100);
                scores.novice = Math.floor(scores.novice / students * 100);

                routeCallback(null, scores);
            })

        })

    });
};

/**
 * This method will return the class average master of a given category
 * @param inputID the userid
 * @param category the category to check
 * @param routeCallback
 */
exports.getClassAverageMasteryForCategory = function (inputID, category, routeCallback) {


    var scores = {
        mastered: 0,
        intermediate: 0,
        novice: 0
    };

    var inputClassToken;

    var numberOfStudents;

    //Find the users token
    async.waterfall([
        function (callback) {
            userModel.findById(inputID, function (err, user) {
                if (err) {
                    callback(err, null);
                }
                inputClassToken = user.token;

                callback(null, user);

            });
        },

        function (user, callback) {
            teacherFunctions.numberOfStudentsInClass(inputClassToken, function (err, students) {
                numberOfStudents = students;
                callback(null, user);
            })
        },

        // find all students that have the same teacher token
        function (user, callback) {

            userModel.find({classToken: user.token, $and: [{"isteacher": false}]}, function (err, users) {
                if (err) {
                    callback(err, null);
                }
                callback(null, users);
            });
        }
    ], function (err, users) {


        async.forEachOf(users, function (student, key, callback) {

            if (!student.isTeacher) {

                studentFunctions.getMasterOfCategoryInts(student._id.toString(), category, function (err, retScores) {

                    scores.mastered = scores.mastered + retScores.mastered;
                    scores.intermediate = scores.intermediate + retScores.intermediate;
                    scores.novice = scores.novice + retScores.novice;

                    callback();
                })
            }


        }, function (err) {

            DBFunctions.getNumberOfQuestionsPerCategory(category, function (err, questionCount) {
                    var totalQuestionsAsked = questionCount * numberOfStudents;
                    scores.mastered = Math.floor(scores.mastered / totalQuestionsAsked * 100);
                    scores.intermediate = Math.floor(scores.intermediate / totalQuestionsAsked * 100);
                    scores.novice = Math.floor(scores.novice / totalQuestionsAsked * 100);

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
exports.getStudentsScores = function (inputID, routeCallback) {


    var retDict = new Dict;

    //Find the users token
    async.waterfall([
        function (callback) {
            userModel.findById(inputID, function (err, user) {
                if (err) {
                    callback(err, null);
                }
                callback(null, user);

            });
        },
        function (user, callback) {
            categoryModel.find({}, function (err, categories) {
                if (err) {
                    callback(err, null);
                }

                //Setup dictionary
                categories.forEach(function (entry) {
                    var questionData = {
                        questions: 0,
                        correct: 0,
                        testPercent: entry.TestPercent
                    };

                    retDict.set(entry.Title, questionData);
                });

                //ser the total number of questions
                retDict.set("totalQuestions", 0);

                retDict.set("totalCorrect", 0);

                callback(null, user);

            });
        },
        function (user, callback) {
            // find all students that have the same teacher token
            userModel.find({classToken: user.token, $and: [{"isteacher": false}]}, function (err, users) {
                if (err) {
                    callback(err, null);
                }
                callback(null, users);
            });
        }
    ], function (err, users) {

        //Count how many students the teacher has

        var numStudents = users.length;


        async.forEachOf(users, function (value, key, callback) {

            studentFunctions.getUserScores(value._id.toString(), function (scores) {
                //merge all the scores


                teacherFunctions.addStudentScoresToTotal(numStudents, retDict, scores);

                callback();


            })


        }, function (err) {

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
exports.addStudentScoresToTotal = function (numStudents, totalScores, studentScore) {

    //Create an array of each key
    var keys = totalScores.keys();

    var tempValue = null;

    //get values for each key
    keys.forEach(function (entry) {
        if (entry == "totalCorrect") {
            tempValue = studentScore.get("totalCorrect") / numStudents;

            tempValue = tempValue + totalScores.get(entry);


            //  totalScores.set(entry , tempValue);

        } else if (entry == "totalQuestions") {
            tempValue = studentScore.get("totalQuestions") / numStudents;

            tempValue = tempValue + totalScores.get(entry);

            // totalScores.set(entry , tempValue);

        } else {

            var sectionScore = studentScore.get(entry);
            var runningTotalScore = totalScores.get(entry);

            tempValue = {
                questions: (sectionScore.questions / numStudents) + runningTotalScore.questions,
                correct: (sectionScore.correct / numStudents) + runningTotalScore.correct,
                testPercent: (sectionScore.testPercent / numStudents) + runningTotalScore.testPercent
            }

        }

        totalScores.set(entry, tempValue);

    })

};

/**
 * This method will count all the students in a class
 * @param teacherToken the class
 */
exports.numberOfStudentsInClass = function (teacherToken, callback) {
    // find all students that have the same teacher token
    userModel.find({classToken: teacherToken, $and: [{"isteacher": false}]}, function (err, users) {
        if (err) {
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
exports.getStudentsMasterys = function (inputID, routeCallback) {

    var retDict = new Dict;

    //Find the users token
    async.waterfall([
        function (callback) {
            userModel.findById(inputID, function (err, user) {
                if (err) {
                    callback(err, null);
                }
                callback(null, user);

            });
        },
        function (user, callback) {
            categoryModel.find({}, function (err, categories) {
                if (err) {
                    callback(err, null);
                }

                //Setup dictionary
                categories.forEach(function (entry) {
                    var questionData = {
                        mastered: 0,
                        intermediate: 0,
                        novice: 0,
                        testPercent: entry.TestPercent
                    };

                    retDict.set(entry.Title, questionData);
                });


                //ser the total number of questions
                retDict.set("TotalMastery", 0);

                retDict.set("TotalIntermediate", 0);

                retDict.set("TotalNovice", 0);

                callback(null, user);

            });
        },
        function (user, callback) {
            // find all students that have the same teacher token
            userModel.find({classToken: user.token, $and: [{"isteacher": false}]}, function (err, users) {
                if (err) {
                    callback(err, null);
                }
                callback(null, users);
            });
        }
    ], function (err, users) {

        //Count how many students the teacher has

        var numStudents = users.length;


        async.forEachOf(users, function (value, key, callback) {

            studentFunctions.getMasteryScores(value._id.toString(), function (scores) {
                //merge all the scores

                teacherFunctions.addStudentMasteryToTotal(numStudents, retDict, scores);

                callback();


            })


        }, function (err) {


            //return the scores with callback(scores);
            routeCallback(retDict);
        })

    });

};

exports.getMissedQuestionsList = function (teacherID, routeCallback) {

    var retList = new list;

    questionFunctions.findQuestionsForUser(teacherID, function (err, questions) {
        if (err) {
            routeCallback(err, null);
        }

        questions.sort(compare);

        questions.forEach(function (entry) {
            var questionData = {
                questionString: entry.questionText,
                questionMissed: entry.incorrectAttempts,
                questionID: entry.baseQuestionID
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
        });

        routeCallback(null, retList.toJSON());
    });

};

/**
 * This method adds a new students questions to the teacher
 * @param studentID
 * @param classID
 * @param callback
 */
exports.addNewStudentsQuestionToTeacher = function (studentID, classID, callback) {
    //Find all the questions that the student has answered

    var studentQuestions;
    var studentQuestion;

    var teacherID;

    var teacherQuestions;
    var teacherQuestion;

    async.waterfall([
            function (wCallback) {
                questionFunctions.findAnsweredQuestions(studentID, function (err, foundQuestions) {

                    studentQuestions = new List(foundQuestions);
                    wCallback();
                })
            },
            function (wCallback) {
                studentFunctions.getTeacher(classID, function (err, foundTeacher) {

                    //TODO: Check if teacher is valid

                    teacherID = foundTeacher[0]._id.toString();
                    wCallback();
                })
            },
            function (wCallback) {
                questionFunctions.findQuestionsForUser(teacherID, function (err, foundQuestions) {
                    teacherQuestions = foundQuestions;
                    wCallback();
                })
            },

            function (wCallback) {
                async.eachSeries(studentQuestions.toArray(), function (iStudentQuestion, sSeries) {

                        studentQuestion = iStudentQuestion;

                        async.eachSeries(teacherQuestions.toArray(), function (iTeacherQuestion, tSeries) {

                            teacherQuestion = iTeacherQuestion;

                            if (studentQuestion.baseQuestionID == teacherQuestion.baseQuestionID) {

                                async.series([
                                        function (seriesCallback) {
                                            if (studentQuestion.responses.a > 0) {
                                                teacherFunctions.addResponsesHelper(teacherID, "a", teacherQuestion, studentQuestion.responses.a, function (err, worked) {

                                                    seriesCallback(err, worked);
                                                })
                                            } else {
                                                seriesCallback(null, "notNeeded");
                                            }
                                        },
                                        function (seriesCallback) {
                                            if (studentQuestion.responses.b > 0) {
                                                teacherFunctions.addResponsesHelper(teacherID, "b", teacherQuestion, studentQuestion.responses.b, function (err, worked) {
                                                    seriesCallback(err, worked);
                                                })
                                            } else {
                                                seriesCallback(null, "notNeeded");
                                            }
                                        },
                                        function (seriesCallback) {
                                            if (studentQuestion.responses.c > 0) {
                                                teacherFunctions.addResponsesHelper(teacherID, "c", teacherQuestion, studentQuestion.responses.c, function (err, worked) {
                                                    seriesCallback(err, worked);
                                                })
                                            } else {
                                                seriesCallback(null, "notNeeded");
                                            }
                                        },
                                        function (seriesCallback) {
                                            if (studentQuestion.responses.d > 0) {
                                                teacherFunctions.addResponsesHelper(teacherID, "d", teacherQuestion, studentQuestion.responses.d, function (err, worked) {
                                                    seriesCallback(err, worked);
                                                })
                                            } else {
                                                seriesCallback(null, "notNeeded");
                                            }
                                        }
                                    ],
                                    function (err, results) {
                                        tSeries(err, "worked");
                                    }
                                );
                            }
                            else {
                                tSeries(null, "worked");
                            }

                        }, function (err, result) {
                            sSeries(err, result);
                        })

                    },
                    function () {
                        wCallback();
                    })
            }
        ],
        function () {
            callback(null, "worked");
        })
};

/**
 * This method will add responses to a teachers question
 * @param teacherID
 * @param response
 * @param teacherQuestion
 * @param count
 * @param callback
 */
exports.addResponsesHelper = function (teacherID, response, teacherQuestion, count, callback) {


    switch (response) {
        case "a":
            teacherQuestion.responses.a = teacherQuestion.responses.a + count;
            break;
        case "b":
            teacherQuestion.responses.b = teacherQuestion.responses.b + count;
            break;
        case "c":
            teacherQuestion.responses.c = teacherQuestion.responses.c + count;
            break;
        case "d":
            teacherQuestion.responses.d = teacherQuestion.responses.d + count;
            break;
    }

    teacherQuestion.numberOfAttempts = teacherQuestion.numberOfAttempts + count;

    if (teacherQuestion.solution == response) {
        teacherQuestion.correctAttempts = teacherQuestion.correctAttempts + count;
    } else {
        teacherQuestion.incorrectAttempts = teacherQuestion.incorrectAttempts + count;

    }


    teacherQuestion.comprehension = calcComprehension(teacherQuestion.numberOfAttempts, teacherQuestion.correctAttempts);


    teacherQuestion.save(function (err, savedQuestion) {
        callback(null, savedQuestion);
    });

};


/**
 * This method will add responses to a teachers question
 * @param teacherID
 * @param response
 * @param teacherQuestion
 * @param count
 * @param callback
 */
exports.removeResponsesHelper = function (teacherID, response, teacherQuestion, count, callback) {
    //Find the question

    //for each response


    switch (response) {
        case "a":
            teacherQuestion.responses.a = teacherQuestion.responses.a - count;
            break;
        case "b":
            teacherQuestion.responses.b = teacherQuestion.responses.b - count;
            break;
        case "c":
            teacherQuestion.responses.c = teacherQuestion.responses.c - count;
            break;
        case "d":
            teacherQuestion.responses.d = teacherQuestion.responses.d - count;
            break;
    }

    teacherQuestion.numberOfAttempts = teacherQuestion.numberOfAttempts - count;

    if (teacherQuestion.solution == response) {
        teacherQuestion.correctAttempts = teacherQuestion.correctAttempts - count;
    } else {
        teacherQuestion.incorrectAttempts = teacherQuestion.incorrectAttempts - count;

    }


    teacherQuestion.comprehension = calcComprehension(teacherQuestion.numberOfAttempts, teacherQuestion.correctAttempts);


    teacherQuestion.save(function (err, savedQuestion) {
        callback(null, savedQuestion);
    });

};

exports.getMissedQuestionsListPerCategory = function (inputTeacherID, category, routeCallback) {
    var retList = new list;

    questionFunctions.findQuestionsForUser(inputTeacherID, function (err, questions) {
        if (err) {
            routeCallback(err, null);
        }

        //Sort the questions
        questions.sort(compare);

        //for each question create a new object then add it to the return list
        questions.forEach(function (entry) {

            if (entry.category == category) {
                var questionData = {
                    questionString: entry.questionText,
                    questionMissed: entry.incorrectAttempts,
                    questionID: entry.baseQuestionID
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

exports.listStudents = function (inputClassToken, routeCallback) {

    var retList = new list;


    //find all the students of the class
    userModel.find({classToken: inputClassToken, $and: [{"isteacher": false}]}, function (err, users) {
        if (err) {
            routeCallback(err, null);
        }

        async.forEachOf(users, function (value, key, callback) {

            var studentObject = {};

            studentObject.email = value.email;

            studentFunctions.getMasteryScores(value._id.toString(), function (scores) {

                studentObject.totalMastery = Math.round(scores.get("TotalMastery"));


                retList.add(studentObject);

                callback();

            })

        }, function (err) {


            //return the scores with callback(scores);
            routeCallback(err, retList.toJSON());
        })

    });

    //add each students email and total mastery to the ret dict

};


exports.getTeacherClassToken = function (inputID, callback) {
    userModel.findById(inputID, function (err, user) {
        if (err) {
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
exports.addStudentMasteryToTotal = function (numStudents, totalScores, studentScore) {

    //Create an array of each key
    var keys = totalScores.keys();

    var tempValue = null;

    //get values for each key
    keys.forEach(function (entry) {

        if (entry == "TotalMastery") {
            tempValue = studentScore.get("TotalMastery") / numStudents;

            tempValue = tempValue + totalScores.get(entry);

            totalScores.set(entry, tempValue);

        } else if (entry == "TotalIntermediate") {
            tempValue = studentScore.get("TotalIntermediate") / numStudents;

            tempValue = tempValue + totalScores.get(entry);

            totalScores.set(entry, tempValue);


        } else if (entry == "TotalNovice") {
            tempValue = studentScore.get("TotalNovice") / numStudents;

            tempValue = tempValue + totalScores.get(entry);

            totalScores.set(entry, tempValue);

        } else {
            var sectionScore = studentScore.get(entry);
            var runningTotalScore = totalScores.get(entry);

            var scores = {
                mastered: (sectionScore.mastered / numStudents ) + runningTotalScore.mastered,
                intermediate: (sectionScore.intermediate / numStudents ) + runningTotalScore.intermediate,
                novice: (sectionScore.novice / numStudents ) + runningTotalScore.novice
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
exports.listStudentsAndCategoryMastery = function (classToken, category, routeCallback) {
    var retList = new list;


    //find all the students of the class
    userModel.find({classToken: classToken, $and: [{"isteacher": false}]}, function (err, users) {
        if (err) {
            routeCallback(err, null);
        }

        async.forEachOf(users, function (value, key, callback) {

            var studentObject = {};

            studentObject.email = value.email;

            studentFunctions.getMasterOfCategory(value._id.toString(), category, function (err, scores) {

                //studentObject.totalMastery = scores.get("TotalMastery");

                //studentObject.totalMastery = DBFunctions.calculateComprehension(scores);

                studentObject.totalMastery = scores.mastered;
                retList.add(studentObject);

                callback();

            })

        }, function (err) {


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


/**
 * This method will return an comprehension object
 * @param numAttempts this is the current number of attempts on this question
 * @param numCorrect this is the number correct answers of this question
 * @returns {{mastered: boolean, intermediate: boolean, novice: boolean}} a comprehension object
 */
function calcComprehension(numAttempts, numCorrect) {

    //TODO: this needs to be pushed to questionFunctions

    var retComprehension = {
        mastered: false,
        intermediate: false,
        novice: false
    };

    var compRatio = numCorrect / numAttempts;

    if (compRatio > .75) {
        retComprehension.mastered = true;
    }
    else if (compRatio < .75 && compRatio > .50) {
        retComprehension.intermediate = true;
    }
    else if (compRatio <= .50) {
        retComprehension.novice = true;
    }

    return retComprehension;

}