const express = require("express")
const router = express.Router()
const { renderHome, vote } = require("../controller/user.controller")

router.get("/", renderHome)
router.post("/vote", vote)

module.exports = router
