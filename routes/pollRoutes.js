const express = require("express");
const router = express.Router();
const pollController = require("../controller/pollController");

// Ensure pollController exports renderHome and vote
router.get("/", pollController.renderHome);
router.post("/vote", pollController.vote);

module.exports = router;
