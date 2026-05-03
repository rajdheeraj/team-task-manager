const Project = require("../models/Project");

// POST /api/projects
const createProject = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Project name is required" });
    }

    const project = await Project.create({
      name,
      createdBy: req.user._id,

      // 🔥 include creator + selected members
      members: [...new Set([req.user._id, ...(members || [])])],
    });

    const populated = await Project.findById(project._id)
      .populate("createdBy", "name")
      .populate("members", "name");

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/projects
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ createdBy: req.user._id }, { members: req.user._id }],
    })
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/projects/:id/members
const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (project.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Only project creator can add members" });

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: userId } },
      { new: true }
    )
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createProject, getMyProjects, addMember, deleteProject };