const router = require('express').Router();
const {
    createJob,
    getAllJobs,
    getEmployerJobs,
    updateJob,
    deleteJob
} = require('../controllers/JobController');

const ensureAuthenticated = require('../middleware/Auth');
const requireRole = require('../middleware/requireRole');
/**
 * PUBLIC
 * Get all jobs (for job seekers)
 */
router.get('/', getAllJobs);

/**
 * PROTECTED - EMPLOYER
 * Create a new job posting
 */
router.post('/', ensureAuthenticated, requireRole('employer'), createJob);

/**
 * PROTECTED - EMPLOYER
 * Get all jobs posted by the authenticated employer
 */
router.get("/my-jobs",ensureAuthenticated,requireRole("employer"),getEmployerJobs);

/**
 * PROTECTED - EMPLOYER
 * Update a job posting
 */
router.put(
  "/:jobId",
  ensureAuthenticated,
  requireRole("employer"),
  updateJob
);

/**
 * PROTECTED - EMPLOYER
 * Delete job
 */
router.delete(
  "/:jobId",
  ensureAuthenticated,
  requireRole("employer"),
  deleteJob
);

module.exports = router;
