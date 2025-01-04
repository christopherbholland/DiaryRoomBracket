const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  episodeNumber: { type: Number, required: true },
  episodeName: { type: String },
  youtubeLink: { type: String },
  hosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Host' }],
  matchups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Matchup' }],
});

module.exports = mongoose.model('Episode', episodeSchema);