const router = require("express").Router();
const uploadResume = require("../middleware/uploadResume");

const {
  getProfile,
  createOrUpdateProfile
} = require("../controllers/JobSeekerProfileController");

const ensureAuthenticated = require("../middleware/Auth");

// 🔐 Get job seeker profile
router.get("/", ensureAuthenticated, getProfile);

// 🔐 Create / Update job seeker profile + Resume Upload
router.post(
  "/",
  ensureAuthenticated,
  uploadResume.single("resume"), // 👈 IMPORTANT
  createOrUpdateProfile
);

module.exports = router;
