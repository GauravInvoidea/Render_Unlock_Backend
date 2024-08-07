const EventRegistration = require("../models/eventRegistration");
const mongoose = require("mongoose");

exports.EventRegistrationController = async (req, res) => {
  const {
    name,
    address,
    email,
    userId,
    eventId,
    registrationDetails,
    eventType,
    paymentAmount,
    registrationStatus,
  } = req.body;

  console.log(req.body);
  console.log(req.files);

  // Handle file uploads
  if (!req.files) {
    return res.status(400).json({ message: "File is required" });
  }

  try {
    // Check if the user has already registered for the same challenge
    const existingRegistration = await EventRegistration.findOne({
      userId,
      eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({ message: "You have already registered for this challenge" });
    }

    // Create new startup challenge registration
    const ChallengeRegistration = new EventRegistration({
      name,
      address,
      email,
      userId,
      eventId,
      registrationDetails,
      eventType,
      paymentAmount,
      registrationStatus,
    });

    // Save new startup challenge
    const savedChallenge = await ChallengeRegistration.save();

    return res.status(201).json({
      message: "Event registered successfully",
      data: savedChallenge,
    });
  } catch (error) {
    console.error("Error registering for challenge", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};



// exports.ShowStartupChallengeRegistrationController = async (req, res) => {
//   const { userId, challengeId } = req.params;

//   try {
//     // Find the registration based on userId and challengeId
//     const registration = await EventRegistration.findOne({
//       userId,
//       challengeId,
//     }).populate('userId', 'name email').populate('challengeId', 'title description');

//     if (!registration) {
//       return res.status(404).json({ message: "Registration not found" });
//     }

//     return res.status(200).json({
//       message: "Registration details fetched successfully",
//       data: registration,
//     });
//   } catch (error) {
//     console.error("Error fetching registration details", error);
//     return res.status(500).json({ message: "Server error. Please try again later." });
//   }
// };

// Get All Registrations Controller


exports.GetEventRegistrationController = async (req, res) => {
  try {
    const registrations = await EventRegistration.find()
      .populate('userId')
      .populate('eventId');

    if (!registrations || registrations.length === 0) {
      return res.status(404).json({ message: "No registrations found" });
    }

    return res.status(200).json({
      message: "All registrations fetched successfully",
      data: registrations,
    });
  } catch (error) {
    console.error("Error fetching registrations", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};
