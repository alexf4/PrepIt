var teacherFunctions = require("../DBWork/teacherFunctions");

var dataToChartHelper = require("../views/dataToChartHelper");

var studentFunctions = require("../DBWork/studentFunctions");

var DBFunctions = require("../DBWork/DBFunctions.js");

var teacher = require("./teacher.js");

var async = require('async');

var userModel = require("../models/user");

exports.settings = function (req, res) {

    var isTeacherData = false;
    var isNewTeacher = false;

    var userEmail;

    var userId = req.user._id.toString();

    userModel.findById(userId, function (err, user) {
        if (err) {
            //callback(err, null);
        }

        if (user.isteacher) {
            isTeacherData = true;
        }


        userEmail = user.email;

        DBFunctions.isNewUser(userId, function (err, userStatus) {
            isNewTeacher = userStatus;

            res.render("settings", {
                ClassCode: this.classToken,
                userEmail: userEmail,
                activeSection: "Settings",
                isTeacher: isTeacherData,
                newTeacher: isNewTeacher
            });

        });

    });
};


exports.updatePassword = function (req, res) {


    var userId = req.user._id.toString();

    //Grab the old password, confirm its correct
    var oldPassword = req.body.OldPassword;

    //update the password with the new one
    var newPassword = req.body.NewPassword;

    //pass info back into deb functions
    DBFunctions.updatePassword(req, userId, oldPassword, newPassword, function (err, done) {

        //TODO: Alex please add isTeacher to these renders with the appropreate true false values
        if (err) {
            res.render("settings", {
                error: req.flash("PasswordUpdateError"),
                success: req.flash("PasswordUpdated")});
        }
        res.render("settings", {
            error: req.flash("PasswordUpdateError"),
            success: req.flash("PasswordUpdated")});
    })


};