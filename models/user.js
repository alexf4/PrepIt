var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionFunctions = require("../DBWork/questionFunctions");


var bcrypt = require('bcrypt-nodejs');

//TODO: Might want to create a question que system


var userSchema = new Schema({

    id: String,
    password: String,
    email: String,
    isteacher: Boolean,
    token: {type: String, unique: true},
    classToken: String,
    questions: [],
    updated: { type: Date, default: Date.now },

});


// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};


//Count the number of questions per category
userSchema.methods.countNumberOfQuestionsPerCategory = function (inputCategory) {
    var numberOfQuestions = 0;

    questionFunctions.findQuestionsForUser(this._id.toString(), function (err, questions) {
        if (err) {
            console.log(err);
        }

        questions.forEach(function (entry) {
            if (entry.category == inputCategory) {
                numberOfQuestions++;

            }
        });
        return numberOfQuestions;
    });
};

//Count the number of questions correct per category
userSchema.methods.numberOfQuestionsCorrectPerCategory = function (inputCategory) {
    var numberOfQuestionsCorrect = 0;


    questionFunctions.findQuestionsForUser(this._id.toString(), function (err, questions) {
        if (err) {
            console.log(err);
        }

        questions.forEach(function (entry) {
            if ((entry.category == inputCategory) && (entry.correct == true)) {
                numberOfQuestionsCorrect++;
            }
            return numberOfQuestionsCorrect;
        });

    });
};


//Count the number of correct answers for user
userSchema.methods.numberOfCorrectAnswersForUser = function () {
    var numberOfQuestionsRight = 0;

    questionFunctions.findQuestionsForUser(this._id.toString(), function (err, questions) {
        if (err) {
            console.log(err);
        }

        questions.forEach(function (entry) {
            if (entry.correct == true) {
                numberOfQuestionsRight++;
            }
            return numberOfQuestionsRight;
        });


    });
};

//Return the next question the user should use
userSchema.methods.findNextQuestion = function (callback) {


    this.findIncorrectQuestion(function (err, question) {
        callback(err, question)
    });

    //if (returnQuestion == null) {
    //    returnQuestion = this.findColdestQuestion();
    //}
    //
    ////TODO this can be updated later
    ////returnQuestion.updateTimeStamp();
    //
    //
    //return returnQuestion;
};

//Return the next question the user should use
userSchema.methods.findNextQuestionFromCategory = function (inputCategory, callback) {


    var returnQuestion;
    this.findIncorrectQuestionFromCategory(inputCategory, function (err, question) {

        returnQuestion = question;

        callback(null, returnQuestion);
    });

    //if (returnQuestion == null) {
    //    returnQuestion = this.findQuestionFromCategory(inputCategory);
    //    //returnQuestion = this.findColdestQuestion;
    //}

    //TODO this can be updated later
    //returnQuestion.updateTimeStamp();


};

//Need a method to open old questions for review

//Find the question that was looked at last
//TODO this needs to be done, I should query the db for the coldest question, I could do a manual search now
userSchema.methods.findColdestQuestion = function () {

};

//Find a question that is incorrect
userSchema.methods.findIncorrectQuestion = function (callback) {
    var possibleQuestions = [];

    questionFunctions.findQuestionsForUser(this._id.toString(), function (err, questions) {
        if (err) {
            callback(err, null);
        }

        questions.forEach(function (entry) {
            if (!entry.correct) {
                possibleQuestions.add(entry);
            }
        });


        //If there are any unleft questions that are wrong choose from there
        //Randomly choose a question

        if (possibleQuestions.length > 0) {
            callback(null, possibleQuestions[Math.floor(Math.random() * possibleQuestions.length)]);
        }else{
            callback(null, questions[Math.floor(Math.random() * questions.length)])
        }

        //return null;
    });
};

/**
 *
 * @returns {*}
 */
userSchema.methods.findIncorrectQuestionFromCategory = function (inputCategory, callback) {
    var possibleQuestions = [];

    questionFunctions.findQuestionsForUser(this._id.toString(), function (err, questions) {
        if (err) {
            callback(err, null);
        }

        questions.forEach(function (entry) {
            if (!entry.correct && entry.category == inputCategory) {
                possibleQuestions.add(entry);
            }


        });


        //If there are any unleft questions that are wrong choose from there
        //Randomly choose a question

        if (possibleQuestions.length > 0) {
            callback(null, possibleQuestions[Math.floor(Math.random() * possibleQuestions.length)]);
        }
        else{

            questions.forEach(function (entry) {
                if (entry.category == inputCategory) {
                    possibleQuestions.add(entry);
                }
            });

            callback(null, possibleQuestions[Math.floor(Math.random() * possibleQuestions.length)]);
        }

        //return null;
    });
};

/**
 *
 * @param inputCategory
 *
 * @returns {*}
 * @param callback
 */
userSchema.methods.findQuestionFromCategory = function (inputCategory, callback) {
    var possibleQuestions = [];


    questionFunctions.findQuestionsForUser(this._id.toString(), function (err, questions) {
        if (err) {
            callback(err, null);
        }

        questions.forEach(function (entry) {
            if (entry.category == inputCategory) {
                possibleQuestions.add(entry);
            }
            //If there are any unleft questions that are wrong choose from there
            //Randomly choose a question

            if (possibleQuestions.length > 0) {
                callback(null, possibleQuestions[Math.floor(Math.random() * possibleQuestions.length)]);
            }

            //return null;


        });
    });
};

module.exports = mongoose.model('User', userSchema);

