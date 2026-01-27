const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    default: null
  },
  googleId: {
    type: String,
    default: null
  },
  provider: {
    type: String,
    enum: ["local", "google"],
    required: true
  },
  // server/models/User.js
  role: {
    type: String,
    enum: ["jobseeker", "employer"],
    default: "jobseeker"
  }

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
