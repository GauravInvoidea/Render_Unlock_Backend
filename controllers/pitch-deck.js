const PitchDecks = require("../models/pitchDeckModel");

exports.createPitchDeck = async (req, res) => {
  try {
    const {
      pitchDeckName,
      pitchDeckDetails,
      category,
      pitchDeckDate,
      currentDate,
      slug
    } = req.body;
    
    const filesArray = req.files.map(file => file.filename);

    const newPitchDeck = new PitchDecks({
      pitchDeckName,
      pitchDeckDetails,
      attachments: filesArray,
      category,
      pitchDeckDate,
      slug,
      createdAt: currentDate
    });

    const savedPitchDeck = await newPitchDeck.save();

    if (savedPitchDeck) {
      res.status(201).json({
        message: "Pitch deck created successfully",
        data: savedPitchDeck,
      });
    } else {
      res.status(500).json({ error: "Unable to create pitch deck" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllPitchDecks = async (req, res) => {
  try {
    const pitchDecks = await PitchDecks.find({});
    res.status(200).json(pitchDecks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getPitchDeckDetails = async (req, res) => {
  try {
    const pitchDeckid = req.query.id

    // Find the startup challenge by ID
    const pitchDeck = await PitchDecks.findById(pitchDeckid);

    if (!pitchDeck) {
      return res.status(404).json({ message: "Startup challenge not found" });
    }
    console.log(pitchDeck)
    return res.status(200).json(pitchDeck)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.updatePaymentStatusOfPitchDeck = async (req, res) => {
  try {
    const { id, paymentStatus, isAdmin } = req.body;

    const challenge = await PitchDecks.findById(id);

    if (isAdmin === true || isAdmin === 'true' || challenge.postedBy === req.user._id) {
      const result = await PitchDecks.findByIdAndUpdate(
        id,
        { paymentStatus: parseInt(paymentStatus) },
        { new: true }
      );

      if (result) {
        return res.status(200).json({
          message: "Payment Status has been changed",
        });
      } else {
        return res.status(404).json({
          message: "Pitch Deck not found",
        });
      }
    } else {
      return res.status(403).json({ message: "Unauthorized User" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.updatePitchDeckDetails = async (req, res) => {
  try {
    const {
      id,
      slug,
      isAdmin,
      pitchDeckName,
      pitchDeckDetails,
      category,
      pitchDeckDate,
      currentDate
    } = req.body;

    if (isAdmin === true || isAdmin === 'true' || challenge.postedBy === req.user._id) {
      // Construct the update object with the fields to be updated
      const updateData = {};
      if (pitchDeckName) updateData.pitchDeckName = pitchDeckName;
      if (slug) updateData.slug = slug;
      if (pitchDeckDetails) updateData.pitchDeckDetails = pitchDeckDetails;
      if (category) updateData.category = category;
      if (pitchDeckDate) updateData.pitchDeckDate = pitchDeckDate;
      if (currentDate) updateData.updatedAt = currentDate;
      if (req.files.length > 0) {
        const filesArray = req.files.map(file => file.filename);
        updateData.attachments = filesArray;
      }

      // Perform the update operation
      const updatedPitchDeck = await PitchDecks.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (updatedPitchDeck) {
        res.status(200).json({
          message: "Pitch deck details have been updated",
          data: updatedPitchDeck,
        });
      } else {
        res.status(404).json({
          message: "Pitch deck not found",
        });
      }
    } else {
      res.status(403).json({
        message: "Unauthorized User",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.deletePitchDeck = async (req, res) => {
  try {
    const { id, isAdmin } = req.body;

    if (isAdmin === true || isAdmin === "true") {
      const deletedPitchDeck = await PitchDecks.findByIdAndDelete(
        id
      );

      if (!deletedPitchDeck) {
        return res.status(404).json({ message: "Pitch Deck not found" });
      }

      res.status(200).json({ message: "Pitch Deck deleted successfully" });
    } else {
      const userId = req.user ? req.user._id : null
      const pitchDeck = PitchDecks.findById(id);

      if (
        userId.toString() !== pitchDeck.postedBy.toString()
      ) {
        return res.status(403).json({ message: "Unauthorized User" });
      }

      const deletedPitchDeck = await PitchDecks.findByIdAndDelete(
        id
      );

      if (!deletedPitchDeck) {
        return res.status(404).json({ message: "Pitch Deck not found" });
      }

      res.status(200).json({ message: "Pitch Deck deleted successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};