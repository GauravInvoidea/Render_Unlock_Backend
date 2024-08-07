const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventRegistrationsSchema = new Schema({
  name: {type : String , require : true },
  address: {type : String , require : true },
  panCardNo: {type : String , require : true },
  userId: { type: Schema.Types.ObjectId, required: true , ref: 'User' }, // Reference to Users document
  eventId: { type: Schema.Types.ObjectId, required: true , ref: 'Event' }, // Reference to Events document
  registrationDetails: { type: String,  },
  eventType: { type: String, required: true , default : null }, // "Paid" or "Free"
  paymentAmount: { type: Schema.Types.Decimal128, required: true , default : 0 }, // If eventType is "Paid"
  registrationStatus: { type: String, required: true , default :0  }, // "Paid" or "Unpaid"
  // createdAt: { type: Date, required: true },
}, {timestamps : true});

module.exports = mongoose.model("EventRegistration", EventRegistrationsSchema);