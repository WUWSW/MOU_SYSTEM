const mongoose = require('mongoose');

const MouSchema = new mongoose.Schema({
  mou_title: {
    type: String,
    required: true
  },
  mou_number: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Approved', 'Rejected', 'Pending', 'Disabled'],
    default: 'Pending'
  },
  document_file: {
    type: String, // เก็บ path เช่น '/uploads/mou123.pdf'
    default: null
  }
}, {
  timestamps: true  // เพิ่ม created_at และ updated_at อัตโนมัติ
});

module.exports = mongoose.model('Mou', MouSchema);
