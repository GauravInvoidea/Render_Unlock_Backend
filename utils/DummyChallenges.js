const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/yourDatabaseName'; // Replace with your MongoDB URI

const StartupChallenges = require("../models/startupChallengesModel");





const generateChallengeData = (count) => {
  const postedById = "66b1e539635a571f9b197d5e"; // Replace with actual postedBy ID
  const categoryId = "668cfc81b6d1ebffc8a440f5"; // Replace with actual category ID
  bannerImagePath = "detail-page-bg.52bf8649.png";
  thumbnailImagepath = "meeting-5395615_1280.jpg" ;
  challengeDetailsData = "There are many variations of passages of Lorem Ipsum available, All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet , but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text ";
  const challenges = [];
  // TypeData = ['premium' , 'not_premium']

  for (let i = 0; i < count; i++) {
    const challenge = {
      challengeName: `Challenge ${i + 1}`,
      challengeDetails: challengeDetailsData,
      thumbnailImage: thumbnailImagepath,
      bannerImage: bannerImagePath , 
      category: categoryId,
      location: "668cff16b6d1ebffc8a44176",
      challengeDate: new Date(`2024-07-${Math.floor(Math.random() * 31) + 1}`),
      postedBy: postedById,
      slug: `challenge-${i + 1}`,
      registrationStartDate: new Date(`2024-07-${Math.floor(Math.random() * 31) + 1}`),
      registrationEndDate: new Date(`2024-07-${Math.floor(Math.random() * 31) + 1}`),
      resultDate: new Date(`2024-07-${Math.floor(Math.random() * 31) + 1}`),
      prizeAmount: (Math.floor(Math.random() * 5000) + 1000).toString(),
      eventMode: Math.random() > 0.5 ? 'online' : 'offline',
      type: Math.random() > 0.5 ? 'premium' : 'not_premium',
      registrationFee: (Math.floor(Math.random() * 5000) + 1000).toString(),

      // paymentStatus: 1,
      paymentStatus: Math.random() > 0.5 ? 1 : 0,
      // status: 2,
      status: Math.random() > 0.5 ? 1 : 0,
      whoCanParticipate: Math.random() > 0.5 ? 'individual' : 'Compapnies',
      company: "company",
   
      __v: 0
    };
    challenges.push(challenge);
  }

  return challenges;
};

const saveChallengesToDatabase = async (count) => {
  try {
    // await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    // console.log('Connected to MongoDB');

    const challengeRecords = generateChallengeData(count);

    const result = await StartupChallenges.insertMany(challengeRecords);
    console.log(`Inserted ${result.length} documents`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error saving challenges:', error);
  }
};

module.exports = { saveChallengesToDatabase };
