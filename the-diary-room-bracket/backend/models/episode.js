const mongoose = require('mongoose');

// Define the schema for an Episode
const episodeSchema = new mongoose.Schema({
  title: { type: String, required: true }, // The episode's title (required)
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'Host' }, // Reference to a Host
  releaseDate: { type: Date }, // Release date of the episode
});

// Export the Episode model
module.exports = mongoose.model('Episode', episodeSchema);