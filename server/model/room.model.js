const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomNumber:{
        type: String,
        required: true,
        unique: true
    },

    roomType:{
        type: String,
        enum:["Triple-Sharing", "Double-Sharing"],
        default: "Double-Sharing",
        required: true
    },

    roomMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

   


}, { timestamps: true })

// Add this virtual property
RoomSchema.virtual('availableBeds').get(function() {
  const totalBeds = this.roomType === "Triple-Sharing" ? 3 : 2;
  return totalBeds - this.roomMembers.length;
});

// Ensure virtuals are included when you send JSON
RoomSchema.set('toJSON', { virtuals: true });
RoomSchema.set('toObject', { virtuals: true });

const Room = mongoose.model("Room", RoomSchema);
module.exports = Room;

