/**
 * Created by alexf4 on 6/19/15.
 */
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var DBFunctions = require("../DBWork/DBFunctions");
var register = require('./registration');
var randomString = require("randomstring");


exports.signup = function(req, res) {

    User.findOne({ 'email' :  req.body.email }, function(err, user) {
        // In case of any error, return using the done method
        if (err){
            console.log('Error in SignUp: '+err);
            return done(err);
        }
        // already exists
        if (user) {
            req.flash('error', "User Already Exists");
            return res.redirect('/register');
        } else {
            // if there is no user with that email
            // create the user
            var newUser = new User();

            var token = randomString.generate({
                length: 7,
                charset: 'hex'
            });

            // set the user's local credentials
            //newUser.username = req.body.username;
            newUser.password = createHash(req.body.password);
            newUser.email = req.param('email');
            newUser.token = token;


            if (req.param('isTeacher')){
                newUser.isteacher = true;

                //If this is a teacher set its teacher token to itself
                newUser.classToken = token;

            }
            else{
                newUser.isteacher = false;
                newUser.classToken = 0;
            }

            // save the user
            newUser.save(function(err , product) {
                if (err){
                    console.log('Error in Saving user: '+err);
                    throw err;
                }
                console.log('User Registration succesful');


                DBFunctions.addQuestionsToUser(product._id.toString() , function (temp){

                    //TODO race case condition, req.session.pasporto.user is not set
                    req.flash('success', "Account Created");
                    res.redirect("/login");

                });

            });
        }
    });


    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}