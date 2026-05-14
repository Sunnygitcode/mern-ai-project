require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const chatRoutes = require("./routes/chat");

const app = express();

// CORS Configuration
app.use(cors({
  origin: [
    "https://sannirajput.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

// Middleware
app.use(express.json());

// API routes
app.use("/api/chat", chatRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Port and DB configuration
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is missing in Environment Variables!");
  process.exit(1);
}

// Database Connection and Server Startup
async function startServer() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");

    mongoose.connection.on("error", (err) => {
      console.error("⚠️ Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ Mongoose disconnected");
    });

    // Start server
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server is live and running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to connect to MongoDB during startup:", err.message);
    process.exit(1);
  }
}

startServer();