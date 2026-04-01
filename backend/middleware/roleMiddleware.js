// Check if user has the right role
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. This page is for ${roles.join(', ')} only.` 
      })
    }
    next()
  }
}