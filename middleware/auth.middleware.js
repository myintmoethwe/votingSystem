const isAdmin = (req, res, next) => {
  // If user is logged in as admin, let them proceed
  if (req.session && req.session.user && req.session.user.isAdmin === true) {
    return next();
  }
  // Otherwise, kick them back to login page
  return res.redirect("/auth/login");
};

module.exports = isAdmin;
