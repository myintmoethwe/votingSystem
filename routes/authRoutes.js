const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

// Secret Admin Routes
router.get("/admin-login", authController.renderAdminLogin);
router.post("/admin-login", authController.adminLogin);
router.get("/logout", authController.logout);

module.exports = router;
