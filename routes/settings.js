var teacherFunctions = require("../DBWork/teacherFunctions");

var dataToChartHelper = require("../views/dataToChartHelper");

var studentFunctions = require("../DBWork/studentFunctions");

var DBFunctions = require("../DBWork/DBFunctions.js");

var teacher = require("./teacher.js");

var async = require('async');


exports.settings = function (req, res) {

    res.render("settings", {ClassCode: this.classToken,
        studentEmail: req.session.studentEmail});

};


exports.updatePassword = function (req, res){


    //Grab the old password, confirm its correct
    var oldPassword = req.body.OldPassword;

    //update the password with the new one
    var newPassword = req.body.NewPassword;


    res.redirect("/settings");
};