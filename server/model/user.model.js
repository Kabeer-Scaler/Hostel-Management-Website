const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student"
    },

    room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    default: null
  },


})

UserSchema.index({ email: 1 }, {
  collation: {
    locale: 'en',
    strength: 2 // 2 = case-insensitive
  }
});

const User = mongoose.model("User", UserSchema)
module.exports = User