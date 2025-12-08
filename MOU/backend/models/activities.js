const mongoose = require('mongoose');

const ActivitiesSchema = new mongoose.Schema(
  {
    activity_id: {
      type: String,
      required: true,
      unique: true,
    },
    mou_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MOU", // ชื่อโมเดล MOU
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    date: {
      type: Date,
      required: true
    },
    place: {
      type: String,
      default: ""
    },
    result_file: {
      type: String, // path เช่น uploads/results/report.pdf
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitiesSchema);
