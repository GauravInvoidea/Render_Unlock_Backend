const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Custom schema type to store either ObjectId or string
const ObjectIdOrString = {
  type: Schema.Types.Mixed,
  validate: {
    validator: function (value) {
      // Check if the value is either an ObjectId or a string
      return (
        mongoose.Types.ObjectId.isValid(value) || typeof value === "string"
      );
    },
    message: "Value must be either ObjectId or string",
  },
};

const EventsSchema = new Schema({
  eventName: { type: String, required: true },
  // postedBy: ObjectIdOrString, // Custom schema type for postedBy field
  postedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },

  slug: { type: String, required: true },
  eventDetails: { type: String, required: true },
  video_url: { type: String, required: true },
  reference_url: { type: String, default: "" },
  thumbnailImage: { type: String, required: true },
  company: { type: String, required: true },
  coverImage: { type: String, required: true },
  // category: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, required: true, ref: 'categories' },

  location: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventMode: { type: String, required: true }, // "online" or "offline"
  eventAddress: { type: String },
  whoCanParticipate: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Event", EventsSchema);