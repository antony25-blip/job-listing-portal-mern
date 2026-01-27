const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ===================== SIGNUP ===================== */
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists, please login",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: role || "jobseeker", // ✅ default role
      provider: "local",
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ===================== LOGIN ===================== */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✅ role included in JWT
    const jwtToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      jwtToken,
      name: user.name,
      email: user.email,
      role: user.role, // ✅ send role to frontend
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ===================== GOOGLE LOGIN ===================== */
const googleLogin = async (req, res) => {
  try {
    const { token, role } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub, email, name } = ticket.getPayload();

    let user = await UserModel.findOne({ email });

    // ✅ create user if not exists
    if (!user) {
      user = await UserModel.create({
        name,
        email,
        googleId: sub,
        role: role || "jobseeker", // ✅ use provided role or default
        provider: "google",
      });
    }

    // ✅ role included in JWT
    const jwtToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      jwtToken,
      name: user.name,
      email: user.email,
      role: user.role, // ✅ send role
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

/* ===================== ME (SESSION) ===================== */
const me = async (req, res) => {
  // req.user is set by requireRole middleware (decoding JWT)
  // We should fetch fresh user data from DB to be safe/current
  try {
    const user = await UserModel.findById(req.user._id); // Assuming _id is in token payload
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.avatar // Adjust if model uses different field, checked auth-context used picture/avatar
    });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { signup, login, googleLogin, me };
