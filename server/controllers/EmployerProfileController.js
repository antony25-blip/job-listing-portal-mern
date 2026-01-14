const EmployerProfile = require("../models/EmployerProfile");

/**
 * @desc    Get logged-in employer profile
 * @route   GET /api/profile/employer
 * @access  Private
 */
exports.getProfile = async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({
      userId: req.user._id
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Employer profile not found"
      });
    }

    res.json({
      success: true,
      profile
    });
  } catch (err) {
    console.error("Get Employer Profile Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * @desc    Create or Update employer profile
 * @route   POST /api/profile/employer
 * @access  Private
 */
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const {
      companyName,
      companyEmail,
      phone,
      website,
      description,
      location,
      logo
    } = req.body;

    const profileData = {
      userId: req.user._id,
      companyName,
      companyEmail,
      phone,
      website,
      description,
      location,
      logo
    };

    const profile = await EmployerProfile.findOneAndUpdate(
      { userId: req.user._id },
      profileData,
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Employer profile saved successfully",
      profile
    });
  } catch (err) {
    console.error("Save Employer Profile Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
