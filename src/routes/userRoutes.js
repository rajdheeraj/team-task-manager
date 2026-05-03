const express = require("express");
const router = express.Router();
const { getUsers, createUser, deleteUser } = require("../controllers/userController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.route("/")
  .get(protect, getUsers)
  .post(protect, restrictTo("admin"), createUser);

router.route("/:id")
  .delete(protect, restrictTo("admin"), deleteUser);

module.exports = router;