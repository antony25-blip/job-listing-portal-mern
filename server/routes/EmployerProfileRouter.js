const router = require("express").Router();
const {
  getProfile,
  createOrUpdateProfile
} = require("../controllers/EmployerProfileController");

const ensureAuthenticated = require("../middleware/Auth");

// 🔐 Protected routes
router.get("/", ensureAuthenticated, getProfile);
router.post("/", ensureAuthenticated, createOrUpdateProfile);

module.exports = router;
