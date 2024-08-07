const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  status: {type: Number, default : 1},
 
}, {timestamps : true});

module.exports = mongoose.model("categories", CategoriesSchema);