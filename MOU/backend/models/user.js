const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  fullname: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  role: {
    type: String,
    enum: ["admin", "staff", "partner", "student"],
    default: "student"
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

// ส่ง model ออกไปใช้
module.exports = mongoose.model("user", userSchema);