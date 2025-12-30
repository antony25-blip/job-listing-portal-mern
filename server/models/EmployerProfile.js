const mongoose = require("mongoose");

const EmployerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true
  },
  companyName: String,
  phone: String,
  location: String,
  website: String,
  description: String
});

module.exports = mongoose.model("EmployerProfile", EmployerProfileSchema);
