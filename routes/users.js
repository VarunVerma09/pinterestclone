const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// connect to DB (better to put this in app.js, not in model file)
mongoose.connect("mongodb://127.0.0.1:27017/PintrestDatabase");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
    password: {
    type: String
  },

});

// add passport-local-mongoose plugin (adds username + hashed password)
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
