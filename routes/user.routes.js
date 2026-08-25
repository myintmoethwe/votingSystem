const express = require("express");
const router = express.Router();
const { renderHome, vote } = require("../controller/user.controller");
const { renderResultsPage } = require("../controller/admin.controller");

router.get("/", renderHome);
router.post("/vote", vote);
router.get("/results", renderResultsPage);

module.exports = router;
