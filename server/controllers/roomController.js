const Room = require("../model/room.model.js");
const User = require("../model/user.model.js");

// @desc    Create a new room (Admin only)
// @route   POST /api/rooms
// @access  Admin
const createRoom = async (req, res) => {
  try {
    const { roomNumber, roomType } = req.body;

    const roomExists = await Room.findOne({ roomNumber });
    if (roomExists) return res.status(400).json({ message: "Room already exists" });

    const room = await Room.create({
      roomNumber,
      roomType,
      roomMembers: []
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Admin + Student
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("roomMembers", "name email");
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Assign student to a room (Admin only)
// @route   PUT /api/rooms/:id/assign
// @access  Admin
const assignStudent = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const { studentId } = req.body;

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // 1. Determine max capacity
    const maxCapacity = room.roomType === "Triple-Sharing" ? 3 : 2;

    // 2. Check roomMembers array
    if (room.roomMembers.length >= maxCapacity) {
      return res.status(400).json({ message: "No available beds" });
    }

    // 3. Check if student is already in a room
    if(student.room) {
       return res.status(400).json({ message: "Student is already assigned to a room" });
    }

    // 4. Check if student is already in THIS room (prevents duplicates)
    if (room.roomMembers.includes(studentId)) {
      return res.status(400).json({ message: "Student is already in this room" });
    }

    // Assign student
    student.room = room._id;
    await student.save();

    room.roomMembers.push(student._id);
    // REMOVE: room.availableBeds -= 1;
    await room.save();

    res.json({ message: "Student assigned successfully", room });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createRoom, getRooms, assignStudent };
