const Events = require("../models/eventsModel");
const axios = require('axios')

exports.createEvent = async (req, res) => {
  try {
    const {
      eventName,
      category,
      location,
      eventDate,
      eventAddress,
      isAdmin,

      eventDetails,
      video_url,
      reference_url,
      eventMode,
      whoCanParticipate,
      slug,
      userId,
      currentDate
    } = req.body;
    console.log(req.body)
    const isEventExist = await Events.findOne({ slug });
    if (isEventExist) {
      return res.status(409).json({
        message: "Event already exist",
      });
    }

    const thumbnailImage = req.files.thumbnailImage?.[0]?.filename;
    const coverImage = req.files.coverImage?.[0]?.filename;

    console.log('isAdmin', isAdmin);
    const postedBy = (isAdmin === true || isAdmin === 'true') ? "admin" : userId;

    const newEvent = new Events({
      eventName,
      postedBy,

      slug,
      category,
      location,
      eventDetails,
      video_url,
      reference_url,
      thumbnailImage,
      coverImage,
      eventDate,
      eventAddress,
      eventMode,
      whoCanParticipate,
      createdAt: currentDate
    });

    const savedEvent = await newEvent.save();

    if (savedEvent) {
      res.status(201).json({
        message: "Event created successfully",
        data: savedEvent,
      });
    } else {
      res.status(500).json({ message: "Unable to create event" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.getAllEventsWithUsers = async (req, res) => {
  try {
    // Retrieve all events
    const events = await Events.find({}).populate('category postedBy')

    // Array to store promises for fetching user details
    // const userDetailPromises = events.map((event) => {
    //   if (event.postedBy === "admin") {
    //     return Promise.resolve({ data: "admin" });
    //   } else {
    //     return axios.get("/api/users/get-particular-user", {
    //       params: {
    //         userId: event.postedBy,
    //       },
    //     });
    //   }
    // });

    // Wait for all promises to resolve
    // const userDetailResponses = await Promise.all(userDetailPromises);

    // // Extract user data from responses
    // const userData = userDetailResponses.map((response) => response.data);

    // // Merge user data into event objects and format the date
    // const eventsWithUserDetails = events.map((event, index) => ({
    //   ...event.toObject(),
    //   postedBy: userData[index],
    //   createdAt: new Date(event.createdAt).toISOString().split('T')[0],
    //   eventDate: new Date(event.eventDate).toISOString().split('T')[0]
    // }));

    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.getEventDetails = async (req, res) => {
  try {
    const eventId = req.query.id
    const isAdmin = req.query.isAdmin

    const event = await Events.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (isAdmin === 'true' || isAdmin === true) {
      return res.status(200).json(event)
    }

    const response = await axios.get("/api/users/get-particular-user", {
      params: {
        userId: event.postedBy,
      },
    });

    if (response.status !== 200) {
      return res.status(500).json({ message: "Failed to fetch user details" });
    }

    const userData = response.data;

    const eventWithUserDetails = {
      ...event.toObject(),
      postedBy: userData,
      eventDate: new Date(event.eventDate).toISOString().split('T')[0]
    };

    res.status(200).json(eventWithUserDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



exports.updateEventDetails = async (req, res) => {
  try {
    const {
      id,
      eventName,
      category,
      location,
      eventDate,

      eventDetails,
      video_url,
      reference_url,
      eventAddress,
      eventMode,
      whoCanParticipate,
      slug,
      currentDate,
      isAdmin
    } = req.body;

    const event = await Events.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // console.log(req.body);


    if (isAdmin === true || isAdmin === 'true' || event.postedBy.toString() === req.user._id.toString()) {
      // if (isAdmin === true || isAdmin === 'true' || event.postedBy === req._id) {

      // Construct the update object with the fields to be updated



      const updateData = {};
      if (eventName) updateData.eventName = eventName;

      if (category) updateData.category = category;
      if (location) updateData.location = location;
      if (eventDate) updateData.eventDate = eventDate;
      if (eventDetails) updateData.eventDetails = eventDetails;
      if (video_url) updateData.video_url = video_url;
      if (reference_url) updateData.reference_url = reference_url;
      if (eventAddress) updateData.eventAddress = eventAddress;
      if (eventMode) updateData.eventMode = eventMode;
      if (whoCanParticipate) updateData.whoCanParticipate = whoCanParticipate;
      if (currentDate) updateData.updatedAt = currentDate
      if (slug) updateData.slug = slug;

      if (req.files.thumbnailImage) updateData.thumbnailImage = req.files.thumbnailImage[0].filename;
      if (req.files.coverImage) updateData.coverImage = req.files.coverImage[0].filename;

      // Perform the update operation

      // console.log("IpdateDAta" , updateData)


      const updatedEvent = await Events.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (updatedEvent) {
        res.status(200).json({
          message: "Event details have been updated",
          data: updatedEvent,
        });
      } else {
        res.status(404).json({
          message: "Event not found",
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


exports.deleteEvent = async (req, res) => {
  try {
    const { id, isAdmin } = req.body;
    console.log(req.body);

    // Check if the user is an admin
    if (isAdmin === true || isAdmin === "true") {
      const deletedEvent = await Events.findByIdAndDelete(id);

      if (!deletedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }

      return res.status(200).json({ message: "Event deleted successfully" });
    } else {
      // Get userId from the request
      const userId = req.user ? req.user._id : null;

      // Find the event by ID
      const event = await Events.findById(id);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if the user is authorized to delete the event
      if (userId.toString() !== event.postedBy.toString()) {
        return res.status(403).json({ message: "Unauthorized User" });
      }

      // Delete the event
      const deletedEvent = await Events.findByIdAndDelete(id);

      if (!deletedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }

      return res.status(200).json({ message: "Event deleted successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
