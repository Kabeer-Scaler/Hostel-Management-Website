const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController.js");

const { protect, authorize } = require("../middleware/authMiddleware.js");

// 🧑‍💼 Admin: Get all users
router.get("/", protect, authorize("admin"), getAllUsers);

// 💡 MOVED: 'me' route must come BEFORE '/:id'
router.get("/me", protect, async (req, res) => {
  res.json(req.user); // already populated by auth middleware
});

// 👤 Get single user (self or admin)
router.get("/:id", protect, getUserById);

// ✏️ Update user details (self or admin)
router.put("/:id", protect, updateUser);

// ❌ Delete user (admin only)
router.delete("/:id", protect, authorize("admin"), deleteUser);

// 🔄 Update user role (admin only)
router.put("/:id/role", protect, authorize("admin"), updateUserRole);

module.exports = router;
