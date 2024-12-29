Here’s a summary of the schema, completed tasks, and upcoming development tasks for your project:

Schema

Houseguest

Represents contestants in the matchups.

const mongoose = require('mongoose');

const houseguestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seasons: [{ type: String }], // Seasons the houseguest appeared in
  hohWins: { type: Number, default: 0 },
  vetoWins: { type: Number, default: 0 },
  nominations: { type: Number, default: 0 },
  placement: { type: Number }, // Final placement in the season
  daysPlayed: { type: Number, default: 0 }, // Total days in the house
});

module.exports = mongoose.model('Houseguest', houseguestSchema);

Matchup

Represents the matchups between houseguests.

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

Episode

Represents episodes where matchups take place.

const episodeSchema = new mongoose.Schema({
  episodeNumber: { type: Number, required: true },
  episodeName: { type: String },
  youtubeLink: { type: String },
  hosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Host' }],
  matchups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Matchup' }],
});

module.exports = mongoose.model('Episode', episodeSchema);

Host

Represents the people hosting episodes and voting.

const hostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }],
});

module.exports = mongoose.model('Host', hostSchema);

Completed Development Tasks
	1.	Matchup Schema Defined:
	•	Added fields for houseguests, votes, voters, winner, and round.
	2.	Houseguest Schema Defined:
	•	Includes attributes like name, seasons, hohWins, and placement.
	3.	Episode and Host Schemas:
	•	Episodes manage matchups, and hosts are associated with episodes and votes.
	4.	MongoDB Integration:
	•	Connected backend to MongoDB Atlas.
	•	Verified connection by creating and saving dummy data.
	5.	Matchup Logic:
	•	Designed a clear model for one-on-one matchups, including:
	•	votesForHG1 and votesForHG2.
	•	votersForHG1 and votersForHG2.

Upcoming Development Tasks

GraphQL Schema Implementation
	1.	Define GraphQL Types:
	•	Add Matchup, Houseguest, Episode, and Host types.
	2.	Add Queries:
	•	Fetch all matchups by round.
	•	Fetch houseguests with their matchup history.
	3.	Add Mutations:
	•	Create a new matchup.
	•	Vote for a houseguest in a matchup.
	•	Calculate the winner based on votes.

Resolvers for Matchups and Relationships
	1.	Query Resolvers:
	•	Resolve nested relationships (e.g., fetch matchups with houseguests and votes).
	2.	Mutation Resolvers:
	•	Implement logic for creating matchups and voting.

Testing and Debugging
	1.	Test Queries and Mutations:
	•	Use GraphQL Playground to ensure the API is functional.
	2.	Database Validation:
	•	Verify data consistency with MongoDB Compass.

Frontend Integration
	1.	Connect Frontend to GraphQL:
	•	Use Apollo Client to fetch and mutate data.
	2.	Bracket Visualization:
	•	Build UI to display matchups by rounds.

Summary

You’re in a great spot with the schema foundation complete and the database connected. The next steps focus on setting up the GraphQL API and preparing for frontend integration.

Let me know when you’re ready, and we’ll start fresh with the next task in the new chat! 🚀