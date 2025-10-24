const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true
    },

    issue:{
        type: String,
        required: true
    },

    status: { 
        type: String, 
        enum: ["Pending", "In Progress", "Resolved"], 
        default: "Pending" 
    },

    date: {
        type: Date,
        default: Date.now

    },

    


})

const Complaint = mongoose.model("Complaint", ComplaintSchema)
module.exports = Complaint