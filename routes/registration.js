/**
 * Created by alexf4 on 5/31/15.
 */


exports.registrationpage = function(req, res ){


  res.render('register2',{error: req.flash('error'), user: "alex"});
};


exports.createUser = function(req, res){


  res.render("teacher");
};