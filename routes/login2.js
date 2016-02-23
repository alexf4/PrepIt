/**
 * Created by alexf4 on 5/30/15.
 */
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');


/**
 * This method will handle the login of a student once they go through passport
 * @param req
 * @param res
 */
exports.auth = function(req, res) {

  //need to check db here

  User.findOne({'email' : req.body.email},
      function (err, user) {
        // In case of any error, return using the done method
        if (err)
          res.redirect("/login");
        // Username does not exist, log the error and redirect back
        if (!user){
          //console.log('User Not Found with username '+username);
          res.redirect("/login");
        }
        // User exists but wrong password, log the error
        if (!isValidPassword(user, req.body.password)){
          console.log('Invalid Password');
          //return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
          res.redirect("/login");
        }
        // User and password both match, return user from done method
        // which will be treated like success
        //Save the user!
        if (user.isteacher) {
          res.redirect("/teacher");
        }
        else {
          //TODO:Need to pass the users name and stats to this page

          res.redirect("/student");
        }
      });


  var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
  }
};