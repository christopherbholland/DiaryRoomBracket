const mongoose = require('mongoose');
const Matchup = require('./models/matchup');
const Houseguest = require('./models/houseguest');

const createMatchups = async () => {
  try {
    await mongoose.connect('mongodb+srv://christopherhollandprojects:B8Yx4EAVm4OhAjPp@podcast-bracket.aes1w.mongodb.net/?retryWrites=true&w=majority&appName=podcast-bracket', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Fetch houseguests
    const houseguest1 = await Houseguest.findOne({ name: 'Contestant A' });
    const houseguest2 = await Houseguest.findOne({ name: 'Contestant B' });

    if (!houseguest1 || !houseguest2) {
      throw new Error('Houseguests not found');
    }

    // Create a matchup
    const matchup = new Matchup({
      houseguest1: houseguest1._id,
      houseguest2: houseguest2._id,
      votesForHG1: 10,
      votesForHG2: 8,
      round: 1,
    });

    await matchup.save();
    console.log('Matchup created:', matchup);

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error creating matchups:', err);
  }
};

createMatchups();