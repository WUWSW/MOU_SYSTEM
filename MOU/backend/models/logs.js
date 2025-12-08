const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // ถ้าคุณมี model ผู้ใช้ชื่อ User
      required: true
    },
    action: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Log", LogSchema);
