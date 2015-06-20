/**
 * Created by alexf4 on 6/19/15.
 */
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');


exports.signup = function(req, res) {

    User.findOne({ 'username' :  req.body.username }, function(err, user) {
        // In case of any error, return using the done method
        if (err){
            console.log('Error in SignUp: '+err);
            return done(err);
        }
        // already exists
        if (user) {
            console.log('User already exists with username: '+username);
            return done(null, false, req.flash('message','User Already Exists'));
        } else {
            // if there is no user with that email
            // create the user
            var newUser = new User();

            // set the user's local credentials
            newUser.username = req.body.username;
            newUser.password = createHash(req.body.password);
            newUser.email = req.param('email');
            newUser.firstName = req.param('firstName');
            newUser.lastName = req.param('lastName');

            // save the user
            newUser.save(function(err) {
                if (err){
                    console.log('Error in Saving user: '+err);
                    throw err;
                }
                console.log('User Registration succesful');

                res.redirect("/teacher");
                //return done(null, newUser);
            });
        }
    });


    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}