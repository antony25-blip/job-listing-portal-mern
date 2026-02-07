const ApplicationModel = require('../models/Application');
const JobModel = require('../models/Job');

const apply = async (req, res) => {
    try {
        const { jobId, coverLetter, resumeUrl } = req.body;
        const applicantId = req.user._id;

        // Check if job exists
        const job = await JobModel.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // Check if already applied
        const existingApplication = await ApplicationModel.findOne({ jobId, applicantId });
        if (existingApplication) {
            return res.status(409).json({ success: false, message: "You have already applied for this job" });
        }

        const application = await ApplicationModel.create({
            jobId,
            applicantId,
            coverLetter,
            resumeUrl
        });

        res.status(201).json({ success: true, message: "Application submitted successfully", application });
    } catch (err) {
        console.error("Apply error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getMyApplications = async (req, res) => {
    try {
        const applicantId = req.user._id;
        const applications = await ApplicationModel.find({ applicantId }).populate('jobId');
        res.json({ success: true, applications });
    } catch (err) {
        console.error("Get My Applications error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await JobModel.findById(jobId);

        // Ensure requester is the employer who posted the job
        if (job.employerId.toString() !== req.user._id) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const applications = await ApplicationModel.find({ jobId }).populate('applicantId', '-password');
        res.json({ success: true, applications });
    } catch (err) {
        console.error("Get Job Applications error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getEmployerApplications = async (req, res) => {
    try {
        // 1. Find all jobs by this employer
        const jobs = await JobModel.find({ employerId: req.user._id });
        const jobIds = jobs.map(job => job._id);

        // 2. Find applications for these jobs
        const applications = await ApplicationModel.find({ jobId: { $in: jobIds } })
            .populate('jobId')
            .populate('applicantId', '-password')
            .sort({ createdAt: -1 });

        res.json({ success: true, applications });
    } catch (err) {
        console.error("Get Employer Applications error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        const application = await ApplicationModel.findById(applicationId).populate('jobId');
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        // Verify employer ownership via job
        if (application.jobId.employerId.toString() !== req.user._id) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        application.status = status;
        await application.save();

        res.json({ success: true, message: "Status updated", application });
    } catch (err) {
        console.error("Update Status error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    apply,
    getMyApplications,
    getJobApplications,
    getEmployerApplications,
    updateStatus
};
