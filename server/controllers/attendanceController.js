const Attendance = require("../model/attendance.model.js");
const User = require("../model/user.model.js");

// @desc Mark attendance for today
// @route POST /api/attendance/mark
// @access Private
exports.markAttendance = async (req, res) => {
    try {
    const userId = req.user._id;

    // 1. Get start of today (e.g., today at 00:00:00)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // 2. Get end of today (e.g., today at 23:59:59)
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // 3. Query using the Date objects
    const alreadyMarked = await Attendance.findOne({
      user: userId,
      date: {
        $gte: startOfToday,
        $lt: endOfToday
      }
    });

    if (alreadyMarked)
      return res.status(400).json({ message: "Attendance already marked" });

    // Create with the default Date.now()
    const attendance = await Attendance.create({ user: userId }); 
    res.status(201).json({ message: "Attendance marked", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get attendance for a user
// @route GET /api/attendance
// @access Private
exports.getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.user._id });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin views all attendance
// @route GET /api/attendance/all
// @access Private/Admin
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate("user", "name email");
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
