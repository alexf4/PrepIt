/**
 * Created by alexf4 on 5/30/15.
 */



exports.auth = function(req, res) {

  //need to check db here
  res.render('home',{message: req.flash('message'), user: "alex"});


};