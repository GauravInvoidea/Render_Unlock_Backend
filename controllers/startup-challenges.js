const StartupChallenges = require("../models/startupChallengesModel");
const axios = require('axios')
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChangeLog = require('../models/ChangeLog');

exports.createStartupChallenge = async (req, res) => {
  try {
    const {
      challengeName,
      challengeDetails,
      company,
      category,
      location,
      challengeDate,
      slugname,
      registrationStartDate,
      registrationEndDate,
      resultDate,
      prizeAmount,
      type,
      registrationFee,
      whoCanParticipate,
      isAdmin,
      userid,
      currentDate
    } = req.body;

    console.log(req.body);

    // Validate required fields
    if (!challengeName || !challengeDetails || !company || !category || !location || !challengeDate || !slugname ||
      !registrationStartDate || !registrationEndDate || !resultDate || !prizeAmount || !type ||
      (type === "premium" && !registrationFee) || !whoCanParticipate || !currentDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if challenge with the same slug exists
    const isChallengeExist = await StartupChallenges.findOne({ slug: slugname });
    if (isChallengeExist) {
      return res.status(409).json({ message: "Startup Challenge already exists" });
    }

    // Handle file uploads
    if (!req.files || !req.files.thumbnailImage || !req.files.bannerImage) {
      return res.status(400).json({ message: "Thumbnail and banner images are required" });
    }

    const thumbnailImage = req.files.thumbnailImage[0].filename;
    const bannerImage = req.files.bannerImage[0].filename;

    // Determine postedBy value
    let postedBy;
    if (isAdmin === true || isAdmin === 'true') {
      postedBy = "admin";
    } else {
      if (!mongoose.Types.ObjectId.isValid(userid)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      postedBy = userid;
    }

    console.log(postedBy, "postedBy", userid, "userid");

    // Create new startup challenge
    const newStartupChallenge = new StartupChallenges({
      challengeName,
      challengeDetails,
      thumbnailImage,
      bannerImage,
      company,
      category,
      location,
      challengeDate,
      postedBy,
      slug: slugname,
      registrationStartDate,
      registrationEndDate,
      resultDate,
      prizeAmount,
      type,
      registrationFee,
      whoCanParticipate,
      createdAt: currentDate,
    });

    // Save new startup challenge
    const savedChallenge = await newStartupChallenge.save();

    if (savedChallenge) {
      return res.status(201).json({
        message: "Startup challenge created successfully",
        data: savedChallenge,
      });
    } else {
      return res.status(500).json({ error: "Unable to create startup challenge" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.getAllStartUpChallenges = async (req, res) => {
//   try {
//     const startupChallenges = await StartupChallenges.find({}).populate('category' );

//     const userDetailPromises = startupChallenges.map((challenge) => {
//       if (challenge.postedBy === "admin") {
//         return Promise.resolve({ data: "admin" });
//       } else {
//         return axios.get("/api/users/get-particular-user", {
//           params: {
//             userId: challenge.postedBy,
//           },
//         });
//       }
//     });

//     const userDetailResponses = await Promise.all(userDetailPromises);

//     const userData = userDetailResponses.map((response) => response.data);

//     const challengesWithUserDetails = startupChallenges.map((challenge, index) => {
//       const challengeObj = challenge.toObject();
//       return {
//         ...challengeObj,
//         postedBy: userData[index],

//       };
//     });

//     res.status(200).json(challengesWithUserDetails);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };




exports.getAllStartUpChallenges = async (req, res) => {
  try {
    const startupChallenges = await StartupChallenges.find({}).populate('category postedBy')

    // const userDetailPromises = startupChallenges.map((challenge) => {








    res.status(200).json(startupChallenges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




exports.getStartupChallengeDetails = async (req, res) => {
  try {
    const challengeId = req.query.id
    const isAdmin = req.query.isAdmin

    // Find the startup challenge by ID
    const startupChallenge = await StartupChallenges.findById(challengeId);

    if (!startupChallenge) {
      return res.status(404).json({ message: "Startup challenge not found" });
    }

    if (isAdmin === 'true' || isAdmin === true) {
      return res.status(200).json(startupChallenge)
    }

    const response = await axios.get("/api/users/get-particular-user", {
      params: {
        userId: startupChallenge.postedBy,
      },
    });

    if (response.status !== 200) {
      return res.status(500).json({ message: "Failed to fetch user details" });
    }

    const userData = response.data;

    const challengeDateFormatted = startupChallenge.challengeDate instanceof Date
      ? startupChallenge.challengeDate.toISOString().split('T')[0]
      : startupChallenge.challengeDate;

    // Merge the user details into the startup challenge object
    const challengeWithUserDetails = {
      ...startupChallenge.toObject(), // Convert the startupChallenge Mongoose document to a plain JavaScript object
      postedBy: userData,
      challengeDate: challengeDateFormatted
    };

    res.status(200).json(challengeWithUserDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



exports.updateStartupChallengeDetails = async (req, res) => {
  try {
    const {
      id,
      challengeName,
      challengeDetails,
      category,
      location,
      company,
      challengeDate,
      slug,
      registrationStartDate,
      registrationEndDate,
      resultDate,
      isAdmin,
      prizeAmount,
      type,
      registrationFee,
      whoCanParticipate,
      currentDate
    } = req.body;

    const challenge = await StartupChallenges.findById(id);

    if (!challenge) {
      return res.status(404).json({
        message: "Startup challenge not found",
      });
    }

    // if (isAdmin === true || isAdmin === 'true' || challenge.postedBy === req.user._id) {
    if (isAdmin === true || isAdmin === 'true' || challenge.postedBy.toString() === req.user._id.toString()) {

      // Construct the update object with the fields to be updated
      const updateData = {};
      if (challengeName) updateData.challengeName = challengeName;
      if (company) updateData.company = company;
      if (challengeDetails) updateData.challengeDetails = challengeDetails;
      if (req.files.thumbnailImage) updateData.thumbnailImage = req.files.thumbnailImage[0].filename;
      if (req.files.bannerImage) updateData.bannerImage = req.files.bannerImage[0].filename;
      if (category) updateData.category = category;
      if (location) updateData.location = location;
      if (challengeDate) updateData.challengeDate = challengeDate;
      if (slug) updateData.slug = slug;
      if (registrationStartDate) updateData.registrationStartDate = registrationStartDate;
      if (registrationEndDate) updateData.registrationEndDate = registrationEndDate;
      if (resultDate) updateData.resultDate = resultDate;
      if (prizeAmount) updateData.prizeAmount = prizeAmount;
      if (type) updateData.type = type;
      if (registrationFee) updateData.registrationFee = registrationFee;
      if (whoCanParticipate) updateData.whoCanParticipate = whoCanParticipate;
      if (currentDate) updateData.updatedAt = currentDate;

      // Get the old data before updating
      const oldChallenge = challenge.toObject();

      // Perform the update operation
      const updatedChallenge = await StartupChallenges.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (updatedChallenge) {
        // Capture new data
        const newChallenge = updatedChallenge.toObject();

        // Determine changes
        const changes = {};
        Object.keys(updateData).forEach(key => {
          if (oldChallenge[key] !== newChallenge[key]) {
            changes[key] = {
              old: oldChallenge[key],
              new: newChallenge[key]
            };
          }
        });

        // Save changes to the Chgg                                                                                                       angeLog model only if there are changes
        if (Object.keys(changes).length > 0) {
          await ChangeLog.create({
            model: 'StartupChallenges',
            recordId: id,
            changes,
            // userId: req.user._id
          });
        }

        res.status(200).json({
          message: "Startup challenge details have been updated",
          data: updatedChallenge,
        });
      } else {
        res.status(404).json({
          message: "Startup challenge not found",
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


exports.updateStatusOfStartupChallenge = async (req, res) => {
  try {
    const { id, status, isAdmin } = req.body;
    const challenge = await StartupChallenges.findById(id);

    if (isAdmin === true || isAdmin === 'true' || challenge.postedBy === req.user._id) {
      const result = await StartupChallenges.findByIdAndUpdate(
        id,
        { status: parseInt(status) },
        { new: true }
      );

      // console.log(result)
      if (result) {
        return res.status(200).json({
          message: "Status has been changed",
        });
      } else {
        return res.status(404).json({
          message: "Startup Challenge not found",
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

exports.updatePaymentStatusOfStartupChallenge = async (req, res) => {
  try {
    const { id, paymentStatus, isAdmin } = req.body;

    const challenge = await StartupChallenges.findById(id);

    if (isAdmin === true || isAdmin === 'true' || challenge.postedBy === req.user._id) {
      const result = await StartupChallenges.findByIdAndUpdate(
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
          message: "Startup Challenge not found",
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.deleteStartupChallenge = async (req, res) => {
  try {
    const { id, isAdmin } = req.body;

    if (isAdmin === true || isAdmin === "true") {
      const deletedChallenge = await StartupChallenges.findByIdAndDelete(
        id
      );

      if (!deletedChallenge) {
        return res.status(404).json({ error: "Startup challenge not found" });
      }

      res.status(200).json({ message: "Startup challenge deleted successfully" });
    } else {
      // Check if the user is authorized to update the event
      const userId = req.user ? req.user._id : null

      const challenge = await StartupChallenges.findById(id);

      // console.log(id, "id")

      // console.log(userId, "userId");

      // console.log(challenge, "challenge")



      if (userId.toString() !== challenge.postedBy.toString()) {
        // If user is not the creator of the event and not superadmin
        return res.status(403).json({ message: "Unauthorized User" });
      }




      // Find the startup challenge by ID and delete it
      const deletedChallenge = await StartupChallenges.findByIdAndDelete(
        id
      );

      if (!deletedChallenge) {
        return res.status(404).json({ message: "Startup challenge not found" });
      }

      res.status(200).json({ message: "Startup challenge deleted successfully" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};