/**
 * Created by alexf4 on 11/27/15.
 */

var studentFunctions = require("../DBWork/studentFunctions");
var DBFunctions = require("../DBWork/DBFunctions.js");


exports.StudentLink= function(req,res){
    //Get the users id
    var userId = req.user._id.toString();

    DBFunctions.getUserEmail(userId, function (err, email) {
        res.render('StudentLink',{
            Title: "Student Teacher Link",
            activeSection: "StudentLink",
            userEmail: email
        });
    });


    //res.render('StudentLink',{
    //    Title: "Student Teacher Link",
    //    activeSection: "StudentLink",
    //    userEmail: req.session.userEmail
    //});
};
/**
 * This method will catch posts to update the student link to teachers
 * @param req
 * @param res
 */
exports.updateStudentLink = function(req, res) {

    //Get the users id
    var userId = req.user._id.toString();

    //Get the form data
    var link = req.body.TeacherID;

    //call the update
    studentFunctions.updateStudentLink( req , userId , link, function(err, worked){

        if(err){

            res.render("StudentLink", {error: req.flash("LinkUpdateError")})
        }else{
            res.redirect('/student');
        }

    })


};

