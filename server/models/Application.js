const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        applicantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["applied", "reviewed", "shortlisted", "rejected"],
            default: "applied",
        },
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        skills: {
            type: [String],
            default: [],
        },
        experience: {
            type: String,
            default: "",
        },
        education: {
            type: String,
            default: "",
        },
        coverLetter: {
            type: String,
            default: "",
        },
        resume: {
            type: String, // URL to resume or text resume
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
