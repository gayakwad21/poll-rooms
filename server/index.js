const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const pollRoutes = require("./routes/pollRoutes");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/polls", pollRoutes);


const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});
app.set("io", io);

// DEBUG: check env
console.log("MONGO_URI:", process.env.MONGO_URI);

// MongoDB connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

connectDB();


// Test route
app.get("/", (req, res) => {
  res.send("Poll Rooms Backend Running");
});

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected");
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
