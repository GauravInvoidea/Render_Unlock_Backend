const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompanyDetailsSchema = new Schema({
  address: { type: String, default : null },
  contactNo: { type: String, default : null },
  url: { type: String, default : null },
  GST: { type: String, default : null },
  // industerytype: { type: String, default : null },

  industerytype: { type: Schema.Types.ObjectId,  ref : 'categories' , default : null} ,
  since : {type : String ,  },
  GST: { type: String, default : null },
  attachments: { type: Array, default : null },
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("CompanyDetails", CompanyDetailsSchema);