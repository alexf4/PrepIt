
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt   = require('bcrypt-nodejs');


var userSchema = new Schema ({

	id: String,
	password: String,
	email: String,
	isteacher: Boolean,
	token: String,
	teacherToken: String,
	questions: []

});


// generating a hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};


//Count the number of questions per category
userSchema.methods.countNumberOfQuestionsPerCategory = function (inputCategory){
	var numberOfQuestions = 0;

	this.questions.forEach(function (entry){
		if (entry.category == inputCategory){
			numberOfQuestions ++;
		}
	});

	return numberOfQuestions;

}

//Count the number of questions correct per category
userSchema.methods.numberOfQuestionsCorrectPerCategory = function (inputCategory){
	var numberOfQuestionsCorrect = 0;


	this.questions.forEach(function (entry){
		if ((entry.category == inputCategory) && (entry.correct == true)) {
			numberOfQuestionsCorrect ++;
		}
	});


	return numberOfQuestionsCorrect;
}


//Count the number of correct answere for user
userSchema.methods.numberOfCorrectAnswersForUser = function(){
	var numberOfQuestionsRight = 0;

	this.questions.forEach(function(entry) {
		if (entry.correct == true){
			numberOfQuestionsRight ++;
		}
	});

	return numberOfQuestionsRight;
}

module.exports = mongoose.model('User', userSchema);

