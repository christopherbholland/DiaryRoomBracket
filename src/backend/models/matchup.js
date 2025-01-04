const mongoose = require('mongoose');

const matchupSchema = new mongoose.Schema({
  houseguest1: { type: mongoose.Schema.Types.ObjectId, ref: 'Houseguest', required: true },
  houseguest2: { type: mongoose.Schema.Types.ObjectId, ref: 'Houseguest', required: true },
  votesForHG1: { type: Number, default: 0 },
  votesForHG2: { type: Number, default: 0 },
  votersForHG1: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Host' }],
  votersForHG2: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Host' }],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Houseguest' },
  round: { type: Number, required: true },
});

module.exports = mongoose.model('Matchup', matchupSchema);