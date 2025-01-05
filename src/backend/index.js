require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4'); // Note the updated path
const bodyParser = require('body-parser');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const startServer = async () => {
  try {
    const app = express();

    // Check for necessary environment variables
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in the .env file');
    }

    // Enable request parsing
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Initialize Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    await server.start();

    // Apply Apollo middleware to the Express app
    app.use('/graphql', expressMiddleware(server));

    // Start the Express server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1); // Exit the process if there's a critical failure
  }
};

startServer();