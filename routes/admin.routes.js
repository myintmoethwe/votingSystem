const express = require("express");
const router = express.Router();
const {
  renderAdminDashboard,
  renderResultsPage,
  renderSettings,
  updateSettings,
  updateParticipant,
  deleteParticipant,
  createParticipant,
} = require("../controller/admin.controller");
const isAdmin = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const adminMiddleware = require("../middleware/auth.middleware");

router.get("/dashboard", isAdmin, (req, res) => {
  res.render("admin-dashboard", { user: req.session.user });
});

router.get("/results", renderResultsPage);
router.get("/settings", renderSettings);
router.post("/settings", updateSettings);

router.post("/update/:id", upload.single("photo"), updateParticipant);
router.get("/delete/:id", deleteParticipant);

// Upload middleware
router.post("/create", upload.single("photo"), createParticipant);

module.exports = router;
