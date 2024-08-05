const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const imgURL = process.env.BASE_URL + "img/avatar.jpg";

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, default: null },
  usertype: { type: String, enum: ["admin", "client"], required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: { type: String, required: true },
  phone: { type: String, default: null },
  profilepic: { type: String, default: imgURL },
  addressLine1: { type: String, default: null },
  addressLine2: { type: String, default: null },
  about: { type: String, default: null },
  lat: { type: Number, default: 0 },
  lng: { type: Number, default: 0 },
  city: { type: String, default: null },
  country: { type: String, default: null },
  state: { type: String, default: null },
  zipcode: { type: String, default: null },
  isProfileSet: { type: Boolean, default: false },
  created_ts: { type: Date, default: Date.now },
  updated_ts: { type: Date, default: null },
});

module.exports = mongoose.model("User", userSchema);
