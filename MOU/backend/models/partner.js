const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
  name_th: String,
  name_en: String,
  address: String,
  contact_person: String,
  contact_phone: String,
  contact_email: String,
  industry_type: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Partner", partnerSchema);
