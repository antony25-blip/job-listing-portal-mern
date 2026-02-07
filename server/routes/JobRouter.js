const router = require('express').Router();
const {
  createJob,
  getAllJobs,
  getEmployerJobs,
  updateJob,
  deleteJob,
  getJobById
} = require('../controllers/JobController');

const ensureAuthenticated = require('../middleware/Auth');
const requireRole = require('../middleware/requireRole');
/**
 * PUBLIC
 * Get all jobs (for job seekers)
 */
router.get('/', getAllJobs);
router.get('/:jobId', (req, res, next) => {
  // Check if jobId is a valid ObjectId to avoid conflict with other routes if any (though here it's fine)
  if (req.params.jobId.match(/^[0-9a-fA-F]{24}$/)) {
    return getJobById(req, res, next);
  }
  next();
});

/**
 * PROTECTED - EMPLOYER
 * Create a new job posting
 */
router.post('/', ensureAuthenticated, requireRole('employer'), createJob);

/**
 * PROTECTED - EMPLOYER
 * Get all jobs posted by the authenticated employer
 */
router.get("/my-jobs", ensureAuthenticated, requireRole("employer"), getEmployerJobs);

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
