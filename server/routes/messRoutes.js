const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware.js");
const {
  getAllMessUsers,
  updateMyMonthlyMess,
  getMessSummary,
  getAllMessOptions,
  addMessOption,
  updateMessOption,
  deleteMessOption,
  getMyMessRecord
} = require("../controllers/messController.js");

router.get("/", protect, authorize("admin"), getAllMessUsers);
router.put("/opt", protect, updateMyMonthlyMess);
router.get("/summary", protect, authorize("admin"), getMessSummary);

// Admin: manage mess options
router.get("/options", protect, getAllMessOptions);
router.post("/option", protect, authorize("admin"), addMessOption);
router.put("/option/:id", protect, authorize("admin"), updateMessOption);
router.delete("/option/:id", protect, authorize("admin"), deleteMessOption);
router.get("/me", protect, getMyMessRecord);

module.exports = router;
