const {
  createParticipant,
  getTotalVotes,
  updateParticipantImage,
  deleteParticipant,
  updateSettings,
  getSettings,
  getWinners,
} = require("../services/admin.services")
const { getAllParticipants } = require("../services/user.services")

exports.createParticipant = async (req, res) => {
  const { name, description, gender } = req.body
  const photo = req.file
    ? `/uploads/${req.file.filename}`
    : "/uploads/default.jpg"
  await createParticipant(name, photo, description, gender)
  res.redirect("/admin/dashboard")
}

exports.updateParticipant = async (req, res) => {
  const id = req.params.id
  const { name, description, gender } = req.body
  const photo = req.file ? `/uploads/${req.file.filename}` : null
  await updateParticipantImage(id, name, photo, description, gender)
  res.redirect("/admin/dashboard")
}

exports.deleteParticipant = async (req, res) => {
  await deleteParticipant(req.params.id)
  res.redirect("/admin/dashboard")
}
exports.renderSettings = async (req, res) => {
  try {
    const settings = await getSettings()
    res.render("admin-settings", { settings })
  } catch (err) {
    console.error("Error rendering settings:", err)
    res.status(500).send("Server Error")
  }
}

exports.updateSettings = async (req, res) => {
  try {
    await updateSettings(req.body)
    res.redirect("/admin/settings")
  } catch (err) {
    console.error("Error updating settings:", err)
    res.status(500).send("Server Error")
  }
}

exports.renderAdminDashboard = async (req, res) => {
  const winners = await getWinners()

  const participants = await getAllParticipants()
  const stats = await getTotalVotes()

  res.render("admin-dashboard", {
    winners,
    stats,
    participants,
    user: req.session.user,
    vote_count: stats,
  })
}

exports.renderResultsPage = async (req, res) => {
  try {
    const winners = await getWinners()
    const stats = await getTotalVotes()

    res.render("results", {
      winners,
    })
  } catch (error) {
    console.error("Error loading results page:", error)
    res.status(500).send("Server Error: " + error.message)
  }
}
