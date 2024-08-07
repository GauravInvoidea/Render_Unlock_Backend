const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const generateEnquiryNo = require('../helpers/generateAlphaNumericCode')

const EnquirySchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  enquiryNo: {
    type: String,
    default: generateEnquiryNo(8)
  },
  email: {
    type: String,
    required: true
  },
  contactNo: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: true
  },
  status: {
    type: Number,
    default: 0
  },

  otherDetails: {
    type: Object
  },
  createdAt: {
    type: String,
    default: Date.now()
  },
});

module.exports = mongoose.model("Enquiry", EnquirySchema);
