const express = require("express");
const router = express.Router();
const { createProject, getMyProjects, addMember, deleteProject } = require("../controllers/projectController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/")
  .get(getMyProjects)
  .post(restrictTo("admin"), createProject);

router.route("/:id")
  .delete(restrictTo("admin"), deleteProject);

router.patch("/:id/members", restrictTo("admin"), addMember);

module.exports = router;