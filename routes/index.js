var express = require('express');
var router = express.Router();
const useModel = require("./users"); // make sure path is correct
const passport = require('passport');
const LocalStrategy = require("passport-local");

passport.use(new LocalStrategy(useModel.authenticate()));

passport.serializeUser(useModel.serializeUser());
passport.deserializeUser(useModel.deserializeUser());

router.get('/', function (req, res, next) {
  res.render('index');
});
router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/register', function (req, res) {
  const useData = new useModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
  });

  useModel.register(useData, req.body.password)
  .then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect('/login');
    });
  });
});

router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
}), function (req, res) {});




router.get('/profile', isLoggedIn, function (req, res) {
  res.render('profile');
  res.send("THIS IS THE PROFILE ROUTE");
});

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
