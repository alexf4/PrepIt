var express = require('express');
var router = express.Router();
var flash = require('connect-flash');


//Setup the routes
var login = require('./login2');
var teacher = require('./teacher');
var register = require('./registration');
var student = require('./student');
var signup = require('./signup');
var question = require('./questionInput');
var freeplay = require('./freePlay');
var settings = require('./settings');
var link = require('./link');


var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
};

module.exports = function (passport) {

    /* GET login page. */
    router.get('/', function (req, res) {

        // Display the Login page with any flash message, if any
        res.render('homePage', {Title: "AP Gov practice test"});
    });


    /* Handle singup POSt */
    //router.post("/signup", mailer.sendmail);
    router.post("/signup", signup.signup);

    /*Handle Registration */
    router.get("/register", register.registrationpage);

    /*handle teacher */
    router.get("/teacher", isAuthenticated, teacher.teacherPage);

    /* Handle student
     */
    router.get("/student", isAuthenticated, student.studentPage);

    /**
     * Admin for adding questions
     */
    router.get("/question", isAuthenticated, question.temp);
    router.post("/addQuestion", isAuthenticated, question.addQuestion);

    /* handle signin post
     * Need to check the user email in the db*/
    router.get("/login", function (req, res) {
        res.render('login', {error: req.flash("error"), success: req.flash("success"), Title: "Login"});
    });

    /* GET Registration Page */
    router.get('/signup', function (req, res) {
        res.render('register', {message: req.flash('message'), Title: "Sign Up"});
    });

    router.post('/removeStudent', isAuthenticated, teacher.removeStudent );
    
    /**
     * Handle the student update link post
     */
        //TODO Figure out why this does not link properly
    router.get("/StudentLink", isAuthenticated, link.StudentLink);

    router.post("/updateStudentLink", isAuthenticated, link.updateStudentLink);


    router.post("/login", loginPost);

    function loginPost(req, res, next) {
        // ask passport to authenticate
        passport.authenticate('local-login', {failureFlash: true}, function (err, user, info) {
            if (err) {
                // if error happens
                return next(err);
            }

            if (!user) {
                // if authentication fail, get the error message that we set
                // from previous (info.message) step, assign it into to
                // req.session and redirect to the login page again to display
                req.session.messages = info.message;
                req.flash('error', info.message);
                return res.redirect('/login');
            }

            // if everything's OK
            req.logIn(user, function (err) {
                if (err) {
                    req.session.messages = "Error";
                    return next(err);
                }

                // set the message
                req.session.messages = "Login successfully";
                if (user.isteacher) {
                    return res.redirect('/teacher');
                }

                return res.redirect('/student');
            });

        })(req, res, next);
    }

    /* Handle Logout */
    router.get('/signout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    //Handle the free play request
    router.get('/freeplay', isAuthenticated, freeplay.startFreePlay);

    //keeps same category as before
    router.get('/freeplaySameCategory', isAuthenticated, freeplay.startCategoryPlay);

    //Handle the free play request with category
    router.get('/freeplay/category/:category', isAuthenticated, function (req, res) {
        //freeplay.setCategory(req.params.category);
        req.session.category = req.params.category;
        res.redirect('/categoryPlay');
    });
    router.get('/categoryPlay', isAuthenticated, freeplay.startCategoryPlay);

    router.get("/termsOfService", function (req, res) {
        res.render('TOS');
    });

    //Handle the freeplay sumbit
    router.post('/freeplaySubmit', isAuthenticated, freeplay.submitAnswer);

    router.get('/teacherDrilldown/student/:studentEmail', isAuthenticated, function (req, res) {
        teacher.emptyOutSessionData(req);
        req.session.studentEmail = req.params.studentEmail;
        res.redirect('/teacherDrilldown');
    });
    router.get('/teacherDrilldown/question/:questionID', isAuthenticated, function (req, res) {
        teacher.emptyOutSessionData(req);
        req.session.questionID = req.params.questionID;
        res.redirect('/teacherDrilldown');
    });
    router.get('/teacherDrilldown/category/:category', isAuthenticated, function (req, res) {
        teacher.emptyOutSessionData(req);
        req.session.category = req.params.category;
        res.redirect('/teacherDrilldown');
    });
    router.get('/teacherDrilldown/clear', isAuthenticated, function (req, res) {
        teacher.emptyOutSessionData(req);
        res.redirect('/teacherDrilldown');
    });
    /*handle teacher */
    router.get("/teacherDrilldown", isAuthenticated, teacher.teacherDrillDown);

    //Handle the question Analysis link from the teacher nav.
    router.get("/questionAnalysis", isAuthenticated, teacher.renderQuestionAnalysis);

    //handle the settings page
    router.get("/settings", isAuthenticated, settings.settings);

    //Handle the password update from settings
    router.post("/updatePassword", isAuthenticated, settings.updatePassword);


    //handle the student list
    router.get("/studentList", isAuthenticated, teacher.renderStudentList);


    // route for facebook authentication and login
    // different scopes while logging in
    router.get('/login/facebook',
        passport.authenticate('facebook', {scope: 'email'}
        ));

    // handle the callback after facebook has authenticated the user
    router.get('/login/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/'
        })
    );

    // route for twitter authentication and login
    // different scopes while logging in
    router.get('/login/twitter',
        passport.authenticate('twitter'));

    // handle the callback after facebook has authenticated the user
    router.get('/login/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/twitter',
            failureRedirect: '/'
        })
    );

    /* GET Twitter View Page */
    router.get('/twitter', isAuthenticated, function (req, res) {
        res.render('twitter', {user: req.user, Title: "Twitter"});
    });

    return router;
};





