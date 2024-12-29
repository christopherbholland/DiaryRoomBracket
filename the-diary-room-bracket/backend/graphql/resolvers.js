const mongoose = require('mongoose');
const Houseguest = require('../models/houseguest');
const Matchup = require('../models/matchup');
const Episode = require('../models/episode');
const Host = require('../models/host');

const resolvers = {
  Query: {
    // Fetch all houseguests
    allHouseguests: async () => {
      return await Houseguest.find();
    },

    // Fetch all matchups
    allMatchups: async () => {
      return await Matchup.find().populate('houseguest1 houseguest2 winner');
    },

    // Fetch all episodes
    allEpisodes: async () => {
      return await Episode.find().populate('hosts matchups');
    },
  },

  Mutation: {
    // Create a new episode
    createEpisode: async (_, { episodeNumber, episodeName, youtubeLink, hostIds, matchupIds }) => {
      // Use `new` to create ObjectId instances
      const objectHostIds = hostIds.map((id) => new mongoose.Types.ObjectId(id));
      const objectMatchupIds = matchupIds.map((id) => new mongoose.Types.ObjectId(id));
      const episode = new Episode({
        episodeNumber,
        episodeName,
        youtubeLink,
        hosts: objectHostIds, // Pass converted ObjectId array
        matchups: objectMatchupIds, // Pass converted ObjectId array
      });
      return await episode.save();
    },

    // Create a new matchup
    createMatchup: async (_, { houseguest1Id, houseguest2Id, round, votesForHG1, votesForHG2 }) => {
      // Convert houseguest IDs to ObjectId
      const objectHouseguest1Id = new mongoose.Types.ObjectId(houseguest1Id);
      const objectHouseguest2Id = new mongoose.Types.ObjectId(houseguest2Id);

      const matchup = new Matchup({
        houseguest1: objectHouseguest1Id,
        houseguest2: objectHouseguest2Id,
        round,
        votesForHG1: votesForHG1 || 0,
        votesForHG2: votesForHG2 || 0,
      });
      return await matchup.save();
    },

    // Cast a vote for a houseguest
    castVote: async (_, { matchupId, voteFor }) => {
      try {
        // Validate the matchupId
        const matchup = await Matchup.findById(matchupId);
        if (!matchup) {
          throw new Error(`Matchup with ID ${matchupId} not found.`);
        }

        // Update vote counts
        if (voteFor === 'houseguest1') {
          matchup.votesForHG1 += 1;
        } else if (voteFor === 'houseguest2') {
          matchup.votesForHG2 += 1;
        } else {
          throw new Error(`Invalid voteFor value: ${voteFor}. Use 'houseguest1' or 'houseguest2'.`);
        }

        return await matchup.save();
      } catch (err) {
        console.error(err.message);
        throw new Error(err.message);
  }
}
  },
}

module.exports = resolvers;