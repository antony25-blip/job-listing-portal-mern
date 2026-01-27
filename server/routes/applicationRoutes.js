const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const authMiddleware = require("../middleware/Auth");

// Apply for a job (Job Seeker)
router.post("/apply", authMiddleware, applicationController.applyJob);

// Get my applications (Job Seeker)
router.get("/my-applications", authMiddleware, applicationController.getMyApplications);

// Get applications for a specific job (Employer)
router.get("/job/:jobId", authMiddleware, applicationController.getJobApplications);

// Update application status (Employer)
router.put("/:applicationId/status", authMiddleware, applicationController.updateStatus);

module.exports = router;
