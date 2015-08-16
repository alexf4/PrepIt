
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

module.exports = mongoose.model('User', userSchema);

