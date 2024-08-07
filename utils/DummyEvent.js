const mongoose = require('mongoose');
const { Schema } = mongoose;
const Events = require("../models/eventsModel");

// const uri = 'mongodb://localhost:27017/yourDatabaseName'; // Replace with your MongoDB URI



const generateEventData = (count) => {
  const events = [];
  const sampleCategories = ['668cfc81b6d1ebffc8a440f5', '668cfd58b6d1ebffc8a4410e', '668cfd69b6d1ebffc8a44112']; 
  const sampleUsers = ['66aa26f970a00ae00d1f8910', '66a0e1b729cd4136121cc60f']; // Replace with actual user IDs
  video_urlDummy = "https://www.youtube.com/watch?v=c7kAfYuPTgA";
  reference_urlDummy = "https://www.youtube.com/watch?v=c7kAfYuPTgA";
  thumbnailImageDummy = "Screenshot from 2024-07-12 14-23-05.png"
  coverImageDummy = "Screenshot from 2024-07-17 13-09-24.png"
  eventDetailsData = "There are many variations of passages of Lorem Ipsum available, All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet , but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text ";
  whoCanParticipate = ['individual' , ]
  for (let i = 0; i < count; i++) {
    const event = {
      eventName: `Event ${i + 1}`,
      postedBy: sampleUsers[Math.floor(Math.random() * sampleUsers.length)],
      slug: `event-${i + 1}`,
      eventDetails: eventDetailsData,  
      video_url: `http://example.com/video${i + 1}`,
      reference_url: `http://example.com/reference${i + 1}`,
      thumbnailImage: thumbnailImageDummy , 
      company: `Company ${i + 1}`,
      coverImage: coverImageDummy ,
      category: sampleCategories[Math.floor(Math.random() * sampleCategories.length)],
      location: `Location ${i + 1}`,
      eventDate: new Date(`2024-07-${Math.floor(Math.random() * 31) + 1}`),
      eventMode: Math.random() > 0.5 ? 'online' : 'offline',
      eventAddress: `Address ${i + 1}`,
      whoCanParticipate: 'individual'
    };
    events.push(event);
  }

  return events;
};

const saveEventsToDatabase = async (count) => {
  try {
 
    const eventRecords = generateEventData(count);

    const result = await Events.insertMany(eventRecords);
    console.log(`Inserted ${result.length} documents`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error saving events:', error);
  }
};

module.exports = { saveEventsToDatabase };
