const Application = require("../models/Application");
const Job = require("../models/Job");

// Apply for a job
exports.applyJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const applicantId = req.user._id;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({ jobId, applicantId });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        const { fullName, email, phone, skills, experience, education, coverLetter } = req.body;

        const application = new Application({
            jobId,
            applicantId,
            fullName,
            email,
            phone,
            skills,
            experience,
            education,
            coverLetter,
            status: "applied",
        });

        await application.save();

        res.status(201).json({ message: "Application submitted successfully", application });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all applications for the logged-in job seeker
exports.getMyApplications = async (req, res) => {
    try {
        const applicantId = req.user._id;
        const applications = await Application.find({ applicantId }).populate("jobId", "title companyName location salaryMin salaryMax");
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all applications for a specific job (Employer only)
exports.getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Verify that the job belongs to the logged-in employer
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Assuming req.user._id is the employer's ID from the token
        if (job.employerId.toString() !== req.user._id) {
            return res.status(403).json({ message: "Not authorized to view these applications" });
        }

        const applications = await Application.find({ jobId }).populate("applicantId", "name email");
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update application status (Employer only)
exports.updateStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        const application = await Application.findById(applicationId).populate("jobId");
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Verify employer ownership
        const job = application.jobId;
        if (job.employerId.toString() !== req.user._id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        application.status = status;
        await application.save();

        res.status(200).json({ message: "Status updated", application });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
