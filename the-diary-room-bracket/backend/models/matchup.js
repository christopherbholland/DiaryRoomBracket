const mongoose = require('mongoose');

// Define the schema for a Matchup
const matchupSchema = new mongoose.Schema({
  episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }], // Array of episodes in the matchup
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }, // Reference to the winning Episode
});

// Export the Matchup model
module.exports = mongoose.model('Matchup', matchupSchema);