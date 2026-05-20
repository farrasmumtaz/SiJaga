const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const http = require("http");

// Initialize background jobs
require("./jobs/lockedStatusCleanup");

// Routes
const userRoutes = require("./routes/userAuthRoute");
const sendIdCardRoutes = require("./routes/sendCardIdRoute");
const userNeeds = require("./routes/userRoute");
const usageHistory = require("./routes/usageHistoryRoutes");

const app = express();


const server = http.createServer(app);
const socketIo = require("socket.io");
const { setIo } = require("./socket");

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

setIo(io);
const availabilityRoutes = require("./routes/availabilityRoute");

console.log("availability loaded");
console.log(availabilityRoutes);
// Middleware
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/availability", availabilityRoutes);

// Socket.IO
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.emit("welcome", "Welcome to the real-time server!");

  socket.on("status_update", (data) => {
    io.emit("status_update", data);
  });
});

// Routes
app.use("/user", userRoutes);
app.use("/card-id", sendIdCardRoutes);
app.use("/user-ess", userNeeds);
app.use("/history", usageHistory);

// 404
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Resource not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    status: false,
    message: "Internal server error",
  });
});
console.log("availability mounted");
module.exports = { app, server};