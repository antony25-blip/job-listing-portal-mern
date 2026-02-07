const router = require('express').Router();
const {
    apply,
    getMyApplications,
    getJobApplications,
    getEmployerApplications,
    updateStatus
} = require('../controllers/ApplicationController');

const ensureAuthenticated = require('../middleware/Auth');
const requireRole = require('../middleware/requireRole');

router.post('/apply', ensureAuthenticated, requireRole('jobseeker'), apply);
router.get('/my-applications', ensureAuthenticated, requireRole('jobseeker'), getMyApplications);
router.get('/employer', ensureAuthenticated, requireRole('employer'), getEmployerApplications);
router.get('/job/:jobId', ensureAuthenticated, requireRole('employer'), getJobApplications);
router.put('/:applicationId/status', ensureAuthenticated, requireRole('employer'), updateStatus);

module.exports = router;
