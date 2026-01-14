const Job = require("../models/Job");

/* ================= CREATE JOB ================= */
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      qualifications,
      responsibilities,
      location,
      salaryMin,
      salaryMax,
      jobType,
    } = req.body;

    // Fetch employer profile to get company name and logo
    const EmployerProfile = require("../models/EmployerProfile");
    const employerProfile = await EmployerProfile.findOne({ userId: req.user._id });

    const job = await Job.create({
      employerId: req.user._id,
      title,
      description,
      qualifications,
      responsibilities,
      location,
      jobType,
      salaryMin,
      salaryMax,
      companyName: employerProfile ? employerProfile.companyName : "Confidential",
      companyLogo: employerProfile ? employerProfile.logo : "",
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/* ================= GET ALL JOBS (PUBLIC) ================= */
exports.getAllJobs = async (req, res) => {
  try {
    const { keyword, jobType, location } = req.query;
    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { qualifications: { $regex: keyword, $options: "i" } },
        { responsibilities: { $regex: keyword, $options: "i" } }
      ];
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const jobs = await Job.find(query)
      .populate("employerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Get All Jobs Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET EMPLOYER JOBS ================= */
exports.getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.user._id });
    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Get Employer Jobs Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= UPDATE JOB ================= */
exports.updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const updatedJob = await Job.findOneAndUpdate(
      { _id: jobId, employerId: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update Job Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= DELETE JOB ================= */
exports.deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findOneAndDelete({
      _id: jobId,
      employerId: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or unauthorized",
      });
    }

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (err) {
    console.error("Delete Job Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
