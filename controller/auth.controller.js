const { ADMIN_USER, ADMIN_PASSWORD } = require("../config/config")

exports.renderAdminLogin = (req, res) => {
  res.render("admin-login", { error: null })
}

exports.adminLogin = (req, res) => {
  const { username, password } = req.body

  const validUser = ADMIN_USER
  const validPass = ADMIN_PASSWORD

  if (username === validUser && password === validPass) {
    // CRITICAL: Set isAdmin flag inside session
    req.session.user = {
      name: "System Admin",
      isAdmin: true,
    }

    // Save session before redirecting to prevent race conditions
    return req.session.save((err) => {
      if (err) {
        return res.status(500).send("Session save error")
      }
      res.redirect("/admin/dashboard")
    })
  }

  res.render("admin-login", {
    error: "Invalid Admin Username or Password",
  })
}

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/")
  })
}
