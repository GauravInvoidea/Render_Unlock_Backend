const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StartupChallengeRegistrationSchema = new Schema({
  name: {type : String , require : true },
  address: {type : String , require : true },
  panCardNo: {type : String , require : true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" }, // Reference to Users document
  challengeId: { type: Schema.Types.ObjectId, required: true, ref: "StartupChallenge" }, // Reference to StartupChallenges document
  registrationDetails: { type: String },
  eventType: { type: String, default : "Free" }, // "Paid" or "Free"
  // paymentAmount: { type: Schema.Types.Decimal128, required: true }, // If eventType is "Paid"
  paymentAmount: { type: Schema.Types.Decimal128}, // If eventType is "Paid"

  registrationStatus: { type: String, default : 0 }, // "Paid" or "Unpaid"
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("StartupChallengeRegistration", StartupChallengeRegistrationSchema);  