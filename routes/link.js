/**
 * Created by alexf4 on 11/27/15.
 */

var studentFunctions = require("../DBWork/studentFunctions");


exports.StudentLink= function(req,res){
    //Get the users id
    userId = req.user._id.toString();

    res.render('StudentLink',{Title: "Student Teacher Link",activeSection: "StudentLink"});
}
/**
 * This method will catch posts to update the student link to teachers
 * @param req
 * @param res
 */
exports.updateStudentLink = function(req, res) {

    //Get the users id
    userId = req.user._id.toString();

    //Get the form data
    link = req.body.TeacherID;

    //call the update
    studentFunctions.updateStudentLink( req , userId , link, function(err, worked){

        if(err){

            res.render("StudentLink", {error: req.flash("LinkUpdateError")})
        }else{
            res.redirect('/student');
        }

    })


}

