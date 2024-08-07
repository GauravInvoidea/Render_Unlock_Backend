const express = require("express");
const router = express.Router();
const startupChallengeController = require('../controllers/startup-challenges');
const { upload } = require("../helpers/multer");
const userAuth = require("../middlewares/userAuth");


router.post("/add-challenge", upload.fields([
  { name: 'thumbnailImage', maxCount: 1 },
  { name: 'bannerImage', maxCount: 1 }
]), startupChallengeController.createStartupChallenge);


router.get("/get-all-challenges", startupChallengeController.getAllStartUpChallenges);
router.get("/get-challenge-details", startupChallengeController.getStartupChallengeDetails);
router.delete("/delete-challenge", userAuth ,  startupChallengeController.deleteStartupChallenge);

router.patch("/update-challenge-details", upload.fields([
  { name: 'thumbnailImage', maxCount: 1 },
  { name: 'bannerImage', maxCount: 1 }
]), userAuth , startupChallengeController.updateStartupChallengeDetails);

router.patch("/update-status-of-challenge", startupChallengeController.updateStatusOfStartupChallenge);
router.patch("/update-payment-status-of-challenge", startupChallengeController.updatePaymentStatusOfStartupChallenge);




module.exports = router;
