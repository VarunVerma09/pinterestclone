let express = require('express');
var router = express.Router();
const useModel = require("./users"); // make sure path is correct
const passport = require('passport');
const LocalStrategy = require("passport-local");
const upload = require('./multer')
const postModel = require('./post')

passport.use(new LocalStrategy(useModel.authenticate()));

passport.serializeUser(useModel.serializeUser());
passport.deserializeUser(useModel.deserializeUser());

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/login', function (req, res, next) {
  res.render('login',{error: req.flash("error")});
  });
router.get('/feed',isLoggedIn, function (req, res, next) {
  res.render('feed');
  });
  
  router.post('/upload', upload.single("file"), async function (req, res, next) {
if(!res.file){
 return res.status(404).send("No Files Were Given");
}
const user = await useModel.findOne({username: req.session.passport.user});
const postData= await postModel.create({
  image: req.file.filename,
  imageText: req.body.filecaption,
  user: user._id,
});
user.post.push(postData._id);
await user.save();
res.send("done")


});


router.get('/profile', isLoggedIn, async function (req, res) {
  const user = await useModel.findOne({
    username:req.session.passport.user
  })
  res.render('profile',{user});
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
  failureFlash:true,
}), function (req, res) {});

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
