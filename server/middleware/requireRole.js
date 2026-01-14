const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Access denied: insufficient permissions"
      });
    }
    next();
  };
};

module.exports = requireRole;
