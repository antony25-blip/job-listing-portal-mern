const mongoose = require("mongoose");

const JobSeekerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  fullName: String,
  phone: String,
  skills: [String],
  experience: [String],
  resumeUrl: String,
  location: String
});

module.exports = mongoose.model("JobSeekerProfile", JobSeekerProfileSchema);
