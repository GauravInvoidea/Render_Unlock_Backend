const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PitchDeckPurchasesSchema = new Schema({
  pitchDeckId: { type: Schema.Types.ObjectId, required: true }, // Reference to PitchDeck document
  userId: { type: Schema.Types.ObjectId, required: true }, // Reference to Users document
  purchaseDetails: { type: String, required: true },
  transactionId: { type: Schema.Types.ObjectId, required: true }, // Reference to Transactions document
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("PitchDeckPurchase", PitchDeckPurchasesSchema);