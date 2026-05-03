const mongoose = require("mongoose");
const Task = require("../models/Task");
const Project = require("../models/Project");

// =======================
// POST /api/tasks
// =======================
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, project } = req.body;

    if (!title || !project) {
      return res.status(400).json({ error: "Title and project are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(project)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ error: "Project not found" });
    }

    // 🔥 Ensure assigned user is part of project (if provided)
    if (assignedTo) {
      const isMember = projectExists.members?.some(
        (m) => m.toString() === assignedTo
      );

      if (!isMember) {
        return res.status(400).json({
          error: "Assigned user must be a project member",
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      assignedTo: assignedTo || null,
      dueDate,
      project,
    });

    const populated = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("project", "name");

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// =======================
// GET /api/tasks
// =======================
const getMyTasks = async (req, res) => {
  try {
    const { status } = req.query;

    const filter =
      req.user.role === "admin"
        ? {}
        : { assignedTo: req.user._id };

    if (status) filter.status = status;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("project", "name")
      .sort({ dueDate: 1, createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// PATCH /api/tasks/:id/status
// =======================
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["todo", "in-progress", "done"];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        error: `Status must be one of: ${allowed.join(", ")}`,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const isAssigned =
      task.assignedTo?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isAssigned && !isAdmin) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this task" });
    }

    task.status = status;
    await task.save();

    const updated = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("project", "name");

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// =======================
// GET /api/tasks/stats
// =======================
const getTaskStats = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin"
        ? {}
        : { assignedTo: req.user._id };

    const tasks = await Task.find(filter);

    const now = new Date();

    const stats = {
      total: tasks.length,
      todo: 0,
      inProgress: 0,
      done: 0,
      overdue: 0,
    };

    tasks.forEach((t) => {
      if (t.status === "todo") stats.todo++;
      else if (t.status === "in-progress") stats.inProgress++;
      else if (t.status === "done") stats.done++;

      if (
        t.dueDate &&
        new Date(t.dueDate) < now &&
        t.status !== "done"
      ) {
        stats.overdue++;
      }
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
module.exports = {
  createTask,
  getMyTasks,
  updateStatus,
  getTaskStats,
};