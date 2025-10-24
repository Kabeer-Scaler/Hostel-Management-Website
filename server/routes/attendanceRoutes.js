const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware.js");
const {
  markAttendance,
  getMyAttendance,
  getAllAttendance,
} = require("../controllers/attendanceController.js");

// Student: mark attendance
router.post("/mark", protect, authorize("student"), markAttendance);

// Student: get own attendance
router.get("/me", protect, authorize("student"), getMyAttendance);

// Admin: get all attendance
router.get("/all", protect, authorize("admin"), getAllAttendance);

module.exports = router;

