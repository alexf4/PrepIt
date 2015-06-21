/**
 * Created by alexf4 on 5/30/15.
 */
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

//Needs acces to student or teachers.


exports.auth = function(req, res) {

  //need to check db here

  User.findOne({'email' : req.body.email},
      function (err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log the error and redirect back
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false, req.flash('message', 'User Not found.'));
        }
        // User exists but wrong password, log the error
        if (!isValidPassword(user, req.body.password)){
          console.log('Invalid Password');
          return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
        }
        // User and password both match, return user from done method
        // which will be treated like success
        //res.render('home',{message: req.flash('message'), user: "alex"});
        //Save the user!
        if (user.isteacher) {
          res.redirect("/teacher");
        }
        else {
          res.redirect("/student");
        }
      });
  //res.render('home',{message: req.flash('message'), user: "alex"});

  var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
  }
};