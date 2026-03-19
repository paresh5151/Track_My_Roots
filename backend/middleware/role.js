export const allowRoles = (...roles) => {
  return (req, res, next) => {
    try {
      // Ensure auth middleware ran
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          message: "Unauthorized: user context missing"
        });
      }

      // Normalize role to avoid case issues
      const userRole = String(req.user.role).toLowerCase();
      const allowed = roles.map(r => String(r).toLowerCase());

      if (!allowed.includes(userRole)) {
        return res.status(403).json({
          message: `Access denied: requires role ${allowed.join(", ")}`
        });
      }

      next();
    } catch (err) {
      console.error("Role Middleware Error:", err.message);
      return res.status(500).json({ message: "Role check failed" });
    }
  };
};
