const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }],
});

module.exports = mongoose.model('Host', hostSchema);