const StartupChallengeRegistration = require("../models/startupchallengeRegistrationModel");
const mongoose = require("mongoose");

exports.StartupChallengeRegistrationController = async (req, res) => {
  const {
    name,
    address,
    email,
    userId,
    challengeId,
    registrationDetails,
    // eventType,
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
    const existingRegistration = await StartupChallengeRegistration.findOne({
      userId,
      challengeId,
    });

    if (existingRegistration) {
      return res.status(400).json({ message: "You have already registered for this challenge" });
    }

    // Create new startup challenge registration
    const ChallengeRegistration = new StartupChallengeRegistration({
      name,
      address,
      email,
      userId,
      challengeId,
      registrationDetails,
      // eventType,
      paymentAmount,
      registrationStatus,
    });

    // Save new startup challenge
    const savedChallenge = await ChallengeRegistration.save();

    return res.status(201).json({
      message: "Startup challenge registered successfully",
      data: savedChallenge,
    });
  } catch (error) {
    console.error("Error registering for challenge", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};



// exports.ShowStartupChallengeRegistrationController = async (req, res) => {
//   const { userId, eventId } = req.params;

//   try {
//     // Find the registration based on userId and eventId
//     const registration = await StartupChallengeRegistration.findOne({
//       userId,
//       eventId,
//     }).populate('userId', 'name email').populate('eventId', 'title description');

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


exports.GetAllRegistrationsController = async (req, res) => {
  try {
    const registrations = await StartupChallengeRegistration.find()
      .populate('userId')
      // .populate('challengeId')
      .populate({
        path: 'challengeId',
        populate: {
          path: 'category' 
        },
        
      });
      

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
