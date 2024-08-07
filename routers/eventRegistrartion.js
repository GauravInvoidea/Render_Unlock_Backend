const express = require("express");
const router = express.Router();
const eventregistartion = require('../controllers/eventRegistrartion');
const { upload } = require("../helpers/multer");


// router.post("/challengeregistration", upload.fields([
//   { name: 'file', maxCount: 1 },
 
// ]), startupchallengeRegistration.startupchallengeRegistration);



router.post("/create-eventregistration", upload.fields([
    { name: 'registrationDetails', maxCount: 1 },
    
  ]), eventregistartion.EventRegistrationController);

router.get("/show-eventregistration" , eventregistartion.GetEventRegistrationController)


module.exports = router;
