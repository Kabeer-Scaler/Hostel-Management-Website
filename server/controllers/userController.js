const User = require("../model/user.model.js");
const Room = require("../model/room.model.js");

// @desc   Get all users (Admin only)
// @route  GET /api/users
// @access Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single user by ID (Admin or self)
// @route  GET /api/users/:id
// @access Private
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Allow access only to self or admin
    if (req.user.role !== "admin" && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update user details (Admin or self)
// @route  PUT /api/users/:id
// @access Private
// @desc   Update user details (Admin or self)
// @route  PUT /api/users/:id
// @access Private
exports.updateUser = async (req, res) => {
  try {
    // FIXED: Only allow name and email updates here
    const { name, email } = req.body; 

    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Only allow self or admin
    if (req.user.role !== "admin" && req.user._id.toString() !== user.id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Add this check to prevent duplicate emails
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    // Update fields
    if (name) user.name = name;

    // REMOVED: Do not update messType or messOpted from here
    // if (messType !== undefined) user.messType = messType;
    // if (messOpted !== undefined) user.messOpted = messOpted;

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete user (Admin only)
// @route  DELETE /api/users/:id
// @access Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.room) {
  await Room.updateOne(
    { _id: user.room },
    { $pull: { roomMembers: user._id } }
  );
}

await user.remove(); 
res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update user role (Admin only)
// @route  PUT /api/users/:id/role
// @access Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["student", "admin"];

    if (!validRoles.includes(role))
      return res.status(400).json({ message: "Invalid role" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.json({ message: "User role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
