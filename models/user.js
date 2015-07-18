
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

/*
This module wll need to be expanded once we figure out all needs from the db.
 */
//module.exports = mongoose.model('User',{
//	id: String,
//	password: String,
//	email: String,
//	isteacher: Boolean,
//	token: String
//
//});

