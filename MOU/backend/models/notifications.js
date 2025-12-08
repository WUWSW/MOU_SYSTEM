const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    mou_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mou",
      required: true
    },
    message: {
      type: String,
      required: true
    },
    is_read: {
      type: Boolean,
      default: false
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Notification", NotificationSchema);
