const JobSeekerProfile = require("../models/JobSeekerProfile");

/**
 * @desc    Get logged-in user's job seeker profile
 * @route   GET /api/profile/jobseeker
 * @access  Private
 */
exports.getProfile = async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findOne({
      userId: req.user._id
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    res.status(200).json({
      success: true,
      profile
    });
  } catch (err) {
    console.error("Get JobSeeker Profile Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * @desc    Create or Update job seeker profile (with resume upload)
 * @route   POST /api/profile/jobseeker
 * @access  Private
 */
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      skills,
      experience,
      location
    } = req.body;

    const profileData = {
      userId: req.user._id,
      fullName,
      phone,
      experience,
      location
    };

    // ✅ Skills can be string or array
    if (skills) {
      profileData.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map(s => s.trim());
    }

    // ✅ Resume upload via multer
    if (req.file) {
      profileData.resumeUrl = `/uploads/resumes/${req.file.filename}`;
    }

    const profile = await JobSeekerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: profileData },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      profile
    });
  } catch (err) {
    console.error("Save JobSeeker Profile Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
