// routes/complaintRoutes.js
const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
} = require("../controllers/complaintController.js");
const { protect, authorize } = require("../middleware/authMiddleware.js");

// Student creates complaint
router.post("/", protect, authorize("student"), createComplaint);

// Student views own complaints
router.get("/me", protect, authorize("student"), getMyComplaints);

// Admin views all complaints
router.get("/all", protect, authorize("admin"), getAllComplaints);

// Admin updates complaint status
router.put("/:id", protect, authorize("admin"), updateComplaintStatus);

module.exports = router;
