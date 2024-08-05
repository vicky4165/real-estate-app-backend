const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactUsSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  subject: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  created_ts: { type: Date, default: Date.now },
  updated_ts: { type: Date, default: null },
});

module.exports = mongoose.model("ContactUs", contactUsSchema);
