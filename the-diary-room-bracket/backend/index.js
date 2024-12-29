require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const startServer = async () => {
  try {
    const app = express();

    // Initialize Apollo Server
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Start the Express server
    const PORT = process.env.PORT || 5000; // Use a fallback port if 4000 is in use
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

startServer();