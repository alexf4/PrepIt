
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema ({

	id: String,
	password: String,
	email: String,
	isteacher: Boolean,
	token: String,
	questions: []

});

var User = mongoose.model('User', userSchema);

module.exports = User;


