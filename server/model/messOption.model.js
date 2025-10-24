const mongoose = require("mongoose");

const MessOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  price: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },
});

const MessOption = mongoose.model("MessOption", MessOptionSchema);
module.exports = MessOption;
