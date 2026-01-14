const mongoose = require("mongoose");

const EmployerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: true
  },
  companyEmail: {
    type: String,
    required: true
  },
  phone: String,
  website: String,
  description: String,
  location: String,
  logo: String
}, { timestamps: true });

module.exports = mongoose.model("EmployerProfile", EmployerProfileSchema);
