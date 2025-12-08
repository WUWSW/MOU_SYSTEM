const mongoose = require('mongoose');

const MouPartnerSchema = new mongoose.Schema({
  mou_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mou',
    required: true
  },
  partner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true
  },
  role: {
    type: String,
    enum: ['้host', 'co-signer', 'sponsor'],
    required: true
  }
}, {
  timestamps: true // createdAt, updatedAt
});

module.exports = mongoose.model('MouPartner', MouPartnerSchema);
