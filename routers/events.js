const express = require("express");
const router = express.Router();
const eventController = require('../controllers/events')
const { upload } = require("../helpers/multer");
const userAuth = require("../middlewares/userAuth");

router.post("/add-event", upload.fields([
  { name: 'thumbnailImage', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), eventController.createEvent);

router.get("/get-all-events", eventController.getAllEventsWithUsers);

router.get("/get-event-details", eventController.getEventDetails);

router.patch("/update-event-details" , upload.fields([
  { name: 'thumbnailImage', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]),userAuth, eventController.updateEventDetails);
router.delete("/delete-event" , userAuth ,eventController.deleteEvent);


module.exports = router;
