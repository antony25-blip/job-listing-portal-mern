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
  experience: {
  type: String,
  enum: ["Fresher", "1-3 years", "3-5 years", "5+ years"]
  },
  resumeUrl: String,
  location: String
});

module.exports = mongoose.model("JobSeekerProfile", JobSeekerProfileSchema);
