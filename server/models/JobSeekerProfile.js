const mongoose = require("mongoose");

const JobSeekerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true
  },
  phone: String,
  location: String,
  skills: [String],
  experience: String,
  resume: String
});

module.exports = mongoose.model("JobSeekerProfile", JobSeekerProfileSchema);
