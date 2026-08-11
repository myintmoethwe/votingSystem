const participantModel = require("../model/participantModel");

exports.renderHome = async (req, res) => {
  const participants = await participantModel.getAll();
  res.render("index", { participants, user: req.session.user || null });
};

exports.renderAdminDashboard = async (req, res) => {
  const participants = await participantModel.getAll();
  res.render("admin-dashboard", { participants, user: req.session.user });
};

exports.createParticipant = async (req, res) => {
  const { name, description } = req.body;
  const photo = req.file
    ? `/uploads/${req.file.filename}`
    : "/uploads/default.jpg";
  await participantModel.create(name, photo, description);
  res.redirect("/admin/dashboard");
};

exports.updateParticipant = async (req, res) => {
  const { id, name, description } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;
  await participantModel.update(id, name, photo, description);
  res.redirect("/admin/dashboard");
};

exports.deleteParticipant = async (req, res) => {
  await participantModel.delete(req.params.id);
  res.redirect("/admin/dashboard");
};
