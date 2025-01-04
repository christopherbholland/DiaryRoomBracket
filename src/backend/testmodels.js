const mongoose = require('mongoose');
const Houseguest = require('./models/houseguest');
const Matchup = require('./models/matchup');
const Episode = require('./models/episode');
const Host = require('./models/host');

const runTest = async () => {
  try {
    await mongoose.connect('mongodb+srv://christopherhollandprojects:FBlU8ou7Rnl8buVg@podcast-bracket.aes1w.mongodb.net/?retryWrites=true&w=majority&appName=podcast-bracket', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Step 1: Create Houseguests
    const houseguest1 = new Houseguest({
      name: 'Contestant A',
      seasons: ['Season 1'],
      hohWins: 3,
      vetoWins: 2,
      nominations: 5,
      placement: 1,
      daysPlayed: 75,
    });

    const houseguest2 = new Houseguest({
      name: 'Contestant B',
      seasons: ['Season 2'],
      hohWins: 2,
      vetoWins: 1,
      nominations: 3,
      placement: 2,
      daysPlayed: 65,
    });

    await houseguest1.save();
    await houseguest2.save();
    console.log('Houseguests saved:', houseguest1, houseguest2);

    // Step 2: Create a Host
    const host = new Host({
      name: 'Host A',
    });

    await host.save();
    console.log('Host saved:', host);

    // Step 3: Create a Matchup
    const matchup = new Matchup({
      houseguest1: houseguest1._id,
      houseguest2: houseguest2._id,
      votesForHG1: 10,
      votesForHG2: 8,
      round: 1,
    });

    await matchup.save();
    console.log('Matchup saved:', matchup);

    // Step 4: Create an Episode
    const episode = new Episode({
      episodeNumber: 1,
      episodeName: 'Premiere Night',
      youtubeLink: 'https://youtube.com/example',
      hosts: [host._id],
      matchups: [matchup._id],
    });

    await episode.save();
    console.log('Episode saved:', episode);

    // Step 5: Associate Host with Episode
    host.episodes.push(episode._id);
    await host.save();
    console.log('Host updated with episodes:', host);

    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
};

runTest();