const express = require("express");
const router = express.Router();

const {
  createTask,
  getMyTasks,
  updateStatus,
  getTaskStats,
} = require("../controllers/taskController");

const { protect, restrictTo } = require("../middleware/authMiddleware");

// 🔒 Protect all routes
router.use(protect);

// =======================
// TASK ROUTES
// =======================

// GET all tasks (admin = all, member = assigned)
// POST create task (admin only)
router.route("/")
  .get(getMyTasks)
  .post(restrictTo("admin"), createTask);

// 📊 Dashboard stats
router.get("/stats", getTaskStats);

// 🔄 Update task status
router.patch("/:id/status", updateStatus);

module.exports = router;