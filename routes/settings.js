var teacherFunctions = require("../DBWork/teacherFunctions");

var dataToChartHelper = require("../views/dataToChartHelper");

var studentFunctions = require("../DBWork/studentFunctions");

var DBFunctions = require("../DBWork/DBFunctions.js");

var teacher = require("./teacher.js");

var async = require('async');

var userModel = require("../models/user");

exports.settings = function (req, res) {

    isTeacherData = false;

    userModel.findById(req.session.passport.user, function (err, user) {
        if (err) {
            //callback(err, null);
        }

        if (user.isteacher) {
            isTeacherData = true;
        }

        //TODO: Alex please help
        newTeacher=null;
        var setNewTeacher =function (newTeacher){
            if (newTeacher==false)
            {
                this.newTeacher=null;
            }
            else
            {
                this.newTeacher=newTeacher;
            };
        };
        userId = req.user._id.toString();
        DBFunctions.isNewUser(userId, function (err, userStatus) {
            setNewTeacher(userStatus);

            DBFunctions.getUserEmail(userId, function (err, email) {
                userEmail = email;
                req.session.userEmail=email;

                res.render("settings", {
                    ClassCode: this.classToken,
                    studentEmail: req.session.studentEmail,
                    activeSection: "Settings",
                    isTeacher: isTeacherData,
                    newTeacher: newTeacher
                });
            });
        });

    });
};


exports.updatePassword = function (req, res) {


    userId = req.user._id.toString();

    //Grab the old password, confirm its correct
    var oldPassword = req.body.OldPassword;

    //update the password with the new one
    var newPassword = req.body.NewPassword;

    //pass info back into deb functions
    DBFunctions.updatePassword(req, userId, oldPassword, newPassword, function (err, done) {

        if (err) {
            res.render( "settings", {error: req.flash("PasswordUpdateError"), success: req.flash("PasswordUpdated")});
        }
        res.render( "settings", {error: req.flash("PasswordUpdateError"), success: req.flash("PasswordUpdated")});
    })


};