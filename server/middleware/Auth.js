const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized, JWT token missing",
      });
    }

    // ✅ Extract token correctly
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({
      message: "Unauthorized, JWT token wrong or expired",
    });
  }
};

module.exports = ensureAuthenticated;
