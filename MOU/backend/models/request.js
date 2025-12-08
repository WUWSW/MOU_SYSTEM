// backend/models/Request.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  request_type: { 
    type: String, 
    enum: ['MOU_CREATE', 'MOU_RENEW', 'ACTIVITY', 'OTHER'], 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: String,
  requester: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'PENDING' 
  },
  related_mou: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Mou', 
    default: null 
  },
  related_partner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Partner', 
    default: null 
  },
  files: [String], // เก็บ path ของไฟล์ที่อัปโหลด
  approved_by: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  },
  approved_at: { 
    type: Date, 
    default: null 
  },
  rejected_reason: String,
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Request', requestSchema);