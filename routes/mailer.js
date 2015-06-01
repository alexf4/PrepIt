/**
 * Created by alexf4 on 5/17/15.
 */
var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

exports.sendmail = function(req, res ){

  var api_key = 'key-2db5b08ab6aba3dd3a0c6098a35111b0';
  var domain = 'sandbox5d7aae1034fb47018daa3148b72bad4d.mailgun.org';
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

  var data = {
    from: 'Excited User <mike@prepit.io>',
    to: req.body.username,
    subject: 'Hello',
    text: 'Testing some Mailgun awesomness!'
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });


  //Need to store user email in a db.
  var newUser = new User();
  // set the user's local credentials
  newUser.username = "temp";
  newUser.password = createHash("temp");
  newUser.email = req.param(req.body.username);
  newUser.firstName = req.param('temp');
  newUser.lastName = req.param('temp');

  // save the user
  newUser.save(function(err) {
    if (err){
      console.log('Error in Saving user: '+err);
      throw err;
    }
    console.log('User Registration succesful');
    //return done(null, newUser);


    //Need to send to thank you page
  });

}



// Generates hash using bCrypt
var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}