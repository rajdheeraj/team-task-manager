const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

/**
 * 🔥 CORS CONFIG (FIXED)
 * - Allows local + Vercel + preview deployments
 */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://team-task-manager-kohl-iota.vercel.app",
    ],
    credentials: true,
  })
);

/**
 * 🔥 Middleware
 */
app.use(express.json());

/**
 * 🔗 Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

/**
 * 🧪 Health Check
 */
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API is running 🚀" });
});

/**
 * ❌ 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = app;