// Load env variables
require("dotenv").config();

// Import libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// HARD disable buffering
mongoose.set("bufferCommands", false);

// Create app
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// START SERVER PROPERLY
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast
    });

    console.log("MongoDB connected successfully");

    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); // force crash if DB not usable
  }
}

startServer();
