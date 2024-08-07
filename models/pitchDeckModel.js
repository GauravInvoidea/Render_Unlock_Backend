const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PitchDeckSchema = new Schema({
  pitchDeckName: { type: String, required: true },
  slug: { type: String, required: true },
  pitchDeckDetails: { type: String, required: true },
  attachments: { type: Array, required: true }, // Multiple attachments; available if payment is done
  category: { type: String, required: true },
  paymentStatus: { type: Number, default: 0 }, // 0 => unpaid, 1 => paid
  status: { type: Number, default: 0 }, // 0 => pending, 1 => pending for approval, 4 => Approved, 5 => Rejected
  pitchDeckDate: { type: Date, required: true },
  createdAt: { type: Date},
  updatedAt: { type: Date},
});

module.exports = mongoose.model("PitchDeck", PitchDeckSchema);