
const Complaint = require("../model/complaint.model.js");

exports.createComplaint = async (req, res) => {
  try {
    // 1. Check if user is assigned to a room
    if (!req.user.room) {
      return res.status(400).json({ message: "You must be assigned to a room to create a complaint." });
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      room: req.user.room, 
      issue: req.body.issue,
    });
    
    await complaint.populate("user", "name email");
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).populate(
      "user",
      "name email"
    );
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("user", "name email");
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    complaint.status = status;
    await complaint.save();
    res.json({ status: complaint.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

