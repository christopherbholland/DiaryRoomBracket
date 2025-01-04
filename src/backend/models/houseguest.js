const mongoose = require('mongoose');

const houseguestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seasons: [{ type: String }],
  hohWins: { type: Number, default: 0 },
  vetoWins: { type: Number, default: 0 },
  nominations: { type: Number, default: 0 },
  placement: { type: Number },
  daysPlayed: { type: Number, default: 0 },
});

module.exports = mongoose.model('Houseguest', houseguestSchema);