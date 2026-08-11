const express = require("express");
const router = express.Router();
const participantController = require("../controller/participantController");
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", participantController.renderHome);
router.get(
  "/admin/dashboard",
  isAuthenticated,
  isAdmin,
  participantController.renderAdminDashboard,
);

router.post(
  "/admin/participant/create",
  isAuthenticated,
  isAdmin,
  upload.single("photo"),
  participantController.createParticipant,
);
router.post(
  "/admin/participant/update",
  isAuthenticated,
  isAdmin,
  upload.single("photo"),
  participantController.updateParticipant,
);
router.get(
  "/admin/participant/delete/:id",
  isAuthenticated,
  isAdmin,
  participantController.deleteParticipant,
);

module.exports = router;
