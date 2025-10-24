const mongoose = require("mongoose");
const MessOption = require("./messOption.model.js"); // Import the MessOption model

const MessSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  month: {
    type: String, // e.g. "October 2025"
    required: true,
  },

  optedIn: {
    type: Boolean,
    default: true, // true = using mess this month
  },

  // FIXED: Changed from String enum to a ref
  messType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MessOption",
    default: null,
  },

  amount: {
    type: Number,
    default: 0,
  },

  dateUpdated: {
    type: Date,
    default: Date.now,
  },
});

// FIXED: Rewritten pre-save hook to be async and fetch correct price
MessSchema.pre("save", async function (next) {
  if (!this.optedIn) {
    // If opted out -> reset values
    this.messType = null;
    this.amount = 0;
  } else if (
    this.isNew ||
    this.isModified("messType") ||
    this.isModified("optedIn")
  ) {
    // If opted in AND the messType changed (or it's a new record)
    // Find the corresponding MessOption document to get its price
    try {
      const messOption = await MessOption.findById(this.messType);
      if (messOption) {
        this.amount = messOption.price;
      } else {
        // Handle case where messType is set but not found (e.g., set default or 0)
        this.amount = 0;
      }
    } catch (error) {
      console.error("Error fetching mess price:", error);
      // Decide how to handle error: set 0, or block save
      this.amount = 0;
      next(error); // Pass error to stop save if needed
    }
  }
  next();
});

const Mess = mongoose.model("Mess", MessSchema);
module.exports = Mess;