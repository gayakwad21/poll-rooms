const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const pollRoutes = require("./routes/pollRoutes");

require("dotenv").config();

const app = express();

/* ⭐ FIX 1 — allow real IP behind Render proxy */
app.set("trust proxy", true);

/* Middlewares */
app.use(cors());
app.use(express.json());

/* Routes */
app.use("/api/polls", pollRoutes);

/* Create HTTP server + Socket.IO */
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.set("io", io);

/* Debug env */
console.log("MONGO_URI:", process.env.MONGO_URI);

/* MongoDB connection */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

connectDB();

/* Health check route */
app.get("/", (req, res) => {
  res.send("Poll Rooms Backend Running");
});

/* Socket connection */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

/* ⭐ FIX 2 — dynamic port for Render */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
