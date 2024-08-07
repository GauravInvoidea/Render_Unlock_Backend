const express = require("express");
const router = express.Router();
const startupchallengeRegistration = require('../controllers/startupchallengeRegistration');
const { upload } = require("../helpers/multer");


// router.post("/challengeregistration", upload.fields([
//   { name: 'file', maxCount: 1 },
 
// ]), startupchallengeRegistration.startupchallengeRegistration);



router.post("/challengeregistration", upload.fields([
    { name: 'registrationDetails', maxCount: 1 },
    
  ]), startupchallengeRegistration.StartupChallengeRegistrationController);

router.get("/showregistration" , startupchallengeRegistration.GetAllRegistrationsController)


module.exports = router;
