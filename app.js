require("dotenv").config(); 
const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
const routes = require("./routes");
const { SESSION_SECRET } = require("./config/config");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set("io", io);

// Socket.io connection listener
io.on("connection", (socket) => {
    socket.on("phone-scanned", () => {
        io.emit("redirect-laptop");
    });
});

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use('/qr_codes', express.static(path.join(__dirname, 'qr_codes')));
app.use('/uploads', express.static(path.join(__dirname, 'middleware/uploads')));
// Session Configuration
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
  }),
);

app.use("/", routes);
module.exports = server;