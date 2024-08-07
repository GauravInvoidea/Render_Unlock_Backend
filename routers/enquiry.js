const express = require("express");
const router = express.Router();

const enquiryController = require("../controllers/enquiry");

router.get("/get-all-enquiries", enquiryController.getAllEnquiries);
router.post("/send-enquiry", enquiryController.newEnquiry);
router.patch("/update-status", enquiryController.toggleStatus);

module.exports = router;
