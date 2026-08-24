const path = require("path")
require("dotenv").config()
const express = require("express")
const app = express()
const session = require("express-session")
const routes = require("./routes")
const { SESSION_SECRET } = require("./config/config")

// View Engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

// Session Configuration
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  }),
)
app.use("/", routes)

module.exports = app
