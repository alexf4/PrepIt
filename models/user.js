
var mongoose = require('mongoose');

/*
This module wll need to be expanded once we figure out all needs from the db.
 */
module.exports = mongoose.model('User',{
	id: String,
	password: String,
	email: String,
	isteacher: Boolean
});



module.exports = mongoose.model('QuestionSet',{
	id: String,
	password: String,
	email: String,
	isteacher: Boolean
});
