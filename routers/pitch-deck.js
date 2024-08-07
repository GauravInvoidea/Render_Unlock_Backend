const express = require("express");
const router = express.Router();
const pitchDeckController = require('../controllers/pitch-deck')
const { upload } = require('../helpers/multer')

router.post("/add-pitch-deck", upload.array('attachments'), pitchDeckController.createPitchDeck);
router.get("/get-all-pitch-decks", pitchDeckController.getAllPitchDecks);
router.get("/get-pitch-deck-details", pitchDeckController.getPitchDeckDetails);
router.patch("/update-pitch-deck-details", upload.array('attachments'), pitchDeckController.updatePitchDeckDetails);
router.patch("/update-status-of-pitch-deck", pitchDeckController.updatePaymentStatusOfPitchDeck);
router.delete("/delete-pitch-deck", pitchDeckController.deletePitchDeck);

module.exports = router;
