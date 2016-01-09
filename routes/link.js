/**
 * Created by alexf4 on 11/27/15.
 */

var studentFunctions = require("../DBWork/studentFunctions");


exports.StudentLink= function(req,res){
    //Get the users id
    userId = req.session.passport.user;

    res.render('StudentLink',{Title: "Student Teacher Link"});
}
/**
 * This method will catch posts to update the student link to teachers
 * @param req
 * @param res
 */
exports.updateStudentLink = function(req, res) {

    //Get the users id
    userId = req.session.passport.user;

    //Get the form data
    link = req.body.TeacherID;

    //call the update
    studentFunctions.updateStudentLink( userId , link, function(){

        //TODO Cody to fill this in correctly.
        //route back to student page
        res.redirect('/student');
    })


}

