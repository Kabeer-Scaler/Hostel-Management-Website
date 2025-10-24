const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware.js");
const { createRoom, getRooms, assignStudent } = require("../controllers/roomController.js");

// Create room (Admin only)
router.post("/", protect, authorize("admin"), createRoom);

// Get all rooms
router.get("/", protect, getRooms);

// Assign student to room (Admin only)
router.put("/:id/assign", protect, authorize("admin"), assignStudent);

module.exports = router;
