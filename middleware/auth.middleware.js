const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.isAdmin === true) {
    return next()
  }
  return res.redirect("/auth/login")
}
module.exports = isAdmin
