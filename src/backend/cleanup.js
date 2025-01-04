const mongoose = require('mongoose');
const Matchup = require('./models/matchup');

const cleanup = async () => {
  try {
    await mongoose.connect('mongodb+srv://christopherhollandprojects:B8Yx4EAVm4OhAjPp@podcast-bracket.aes1w.mongodb.net/?retryWrites=true&w=majority&appName=podcast-bracket', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Delete all matchups
    await Matchup.deleteMany({});
    console.log('All matchups cleared');

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
};

cleanup();