const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GeneralSettingsSchema = new Schema({
    sitetitle: {
        type: String,
        required: true
    },
    slogan: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    favicon: {
        type: String,
        required: true
    },
    adminemail: {
        type: String,
        required: true
    },
    admincontactno: {
        type: Number,
        required: true
    },
    timezone: {
        type: String,
        required: true
    },
    whatsappno: {
        type: Number,
        required: true
    },
    facebookurl: {
        type: String,
        required: true
    },
    instagramurl: {
        type: String,
        required: true
    },
    twitterurl: {
        type: String,
        required: true
    },
    linkedinurl: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
   
    currency:{
        type: String,
        required: true
    }
}, {timestamps : true});

module.exports = mongoose.model("GeneralSetting", GeneralSettingsSchema);
