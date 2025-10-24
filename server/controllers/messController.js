const User = require("../model/user.model.js");
const MessOption = require("../model/messOption.model.js");
const Mess = require("../model/mess.model.js");

// 🧾 Get all students with mess info (Admin)
// 🧾 Get all mess records for the current month (Admin) (FIXED)
exports.getAllMessUsers = async (req, res) => {
  try {
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    const messRecords = await Mess.find({ month: currentMonth })
      .populate("user", "name email room") // Populate user details
      .populate("messType", "name price"); // Populate mess details

    res.json(messRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🍽️ Student: Opt in or out of mess
// In messController.js
// This replaces your 'updateMessOpt'
exports.updateMyMonthlyMess = async (req, res) => {
  try {
    const { optedIn, messTypeId } = req.body;
    const userId = req.user._id;

    // 1. Get current month string (e.g., "October 2025")
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    // 2. Find this user's mess record FOR THIS MONTH
    let messRecord = await Mess.findOne({ user: userId, month: currentMonth });

    if (!messRecord) {
      // If no record, create a new one
      messRecord = new Mess({ user: userId, month: currentMonth });
    }

    // 3. Update the record
    if (optedIn) {
      if (!messTypeId) return res.status(400).json({ message: "Mess type is required" });
      
      const messOption = await MessOption.findById(messTypeId);
      if (!messOption) return res.status(404).json({ message: "Mess option not found" });

      messRecord.optedIn = true;
      messRecord.messType = messOption._id; // This should be the ObjectId
    } else {
      // Opting out
      messRecord.optedIn = false;
      messRecord.messType = null;
    }
    
    // The pre-save hook on mess.model.js will
    // automatically calculate the price ('amount')
    await messRecord.save();
    
    res.json({ message: "Mess preference updated", messRecord });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 💰 Admin: Get mess fee summary dynamically
// 💰 Admin: Get mess fee summary dynamically (FIXED)
exports.getMessSummary = async (req, res) => {
  try {
    // 1. Get current month string
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    // 2. Find all opted-in mess records FOR THIS MONTH
    const messRecords = await Mess.find({ 
        month: currentMonth, 
        optedIn: true 
      })
      .populate("messType", "name price");

    const summary = {};
    let total = 0;

    // Initialize summary from MessOption collection
    const messOptions = await MessOption.find();
    messOptions.forEach((opt) => (summary[opt.name] = 0));

    // 3. Tally the bill from the monthly records
    messRecords.forEach((record) => {
      if (record.messType) {
        summary[record.messType.name] += record.messType.price;
        total += record.messType.price;
      }
    });

    res.json({ summary, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllMessOptions = async (req, res) => {
  try {
    const options = await MessOption.find();
    res.json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🆕 Admin: Add a new mess option
exports.addMessOption = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const exists = await MessOption.findOne({ name });
    if (exists) return res.status(400).json({ message: "Mess option already exists" });

    const option = new MessOption({ name, price, description });
    await option.save();

    res.status(201).json({ message: "New mess option added", option });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Admin: Update an existing mess option
exports.updateMessOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    const option = await MessOption.findById(id);
    if (!option) return res.status(404).json({ message: "Mess option not found" });

    option.name = name || option.name;
    option.price = price || option.price;
    option.description = description || option.description;

    await option.save();
    res.json({ message: "Mess option updated", option });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Admin: Delete mess option
exports.deleteMessOption = async (req, res) => {
  try {
    const { id } = req.params;
    const option = await MessOption.findByIdAndDelete(id);

    if (!option) return res.status(404).json({ message: "Mess option not found" });
    res.json({ message: "Mess option deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... in server/controllers/messController.js

// 🙋 Student: Get my mess record for the current month
exports.getMyMessRecord = async (req, res) => {
  try {
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    const messRecord = await Mess.findOne({
      user: req.user._id,
      month: currentMonth
    }).populate('messType');

    if (!messRecord) {
      // No record exists, send back a default "opted-out" state
      return res.json({
        optedIn: false,
        messType: null,
      });
    }

    res.json(messRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
