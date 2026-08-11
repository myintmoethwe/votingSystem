exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect("/admin-login");
};

exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.isAdmin === true) {
    return next();
  }
  return res.status(403).send("Access Denied: Admin only.");
};
