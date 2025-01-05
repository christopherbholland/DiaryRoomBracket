const { gql } = require('graphql-tag');

const typeDefs = gql`
  # Define the Houseguest type
  type Houseguest {
    id: ID!
    name: String!
    seasons: [String]
    hohWins: Int
    vetoWins: Int
    nominations: Int
    placement: Int
    daysPlayed: Int
  }

  # Define the Matchup type
  type Matchup {
    id: ID!
    houseguest1: Houseguest!
    houseguest2: Houseguest!
    votesForHG1: Int
    votesForHG2: Int
    round: Int!
    winner: Houseguest
  }

  # Define the Episode type
  type Episode {
    id: ID!
    episodeNumber: Int!
    episodeName: String
    youtubeLink: String
    hosts: [Host]
    matchups: [Matchup]
  }

  # Define the Host type
  type Host {
    id: ID!
    name: String!
    episodes: [Episode]
  }

  # Queries for retrieving data
  type Query {
    allHouseguests: [Houseguest]     # Fetch all Houseguest objects
    allMatchups: [Matchup]           # Fetch all Matchup objects
    allEpisodes: [Episode]           # Fetch all Episode objects
  }

  # Mutations for modifying data
  type Mutation {
    # Create a new episode
    createEpisode(
      episodeNumber: Int!,
      episodeName: String,
      youtubeLink: String,
      hostIds: [ID!]!,
      matchupIds: [ID!]
    ): Episode!

    # Create a new matchup
    createMatchup(
      houseguest1Id: ID!,
      houseguest2Id: ID!,
      round: Int!,
      votesForHG1: Int = 0,
      votesForHG2: Int = 0
    ): Matchup!

    # Cast a vote for a houseguest
    castVote(
      matchupId: ID!,
      voteFor: String!
    ): Matchup!
  }
`;

module.exports = typeDefs;