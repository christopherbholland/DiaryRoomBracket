const mongoose = require('mongoose');

// Define the schema for a Host
const hostSchema = new mongoose.Schema({
  name: { type: String, required: true }, // The host's name (required)
  episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }], // Array of references to Episodes
});

// Export the Host model
module.exports = mongoose.model('Host', hostSchema);