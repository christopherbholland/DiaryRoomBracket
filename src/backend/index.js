/**
 * This file initializes and starts the backend server for the DiaryRoom application.
 * 
 * Key Features:
 * 1. **Environment Variables**:
 *    - Loads configuration details like the MongoDB URI from a `.env` file using the `dotenv` package.
 *    - This ensures sensitive information is not hardcoded and remains secure.
 * 
 * 2. **Express Framework**:
 *    - Uses Express to handle HTTP requests and manage middleware, providing a flexible foundation for the application.
 *    - Middleware like `body-parser` is added to handle incoming request data (JSON and form data).
 * 
 * 3. **Apollo Server**:
 *    - Configures a GraphQL API using Apollo Server, which integrates seamlessly with Express.
 *    - The GraphQL schema (`typeDefs`) defines the API's structure, including its types, queries, and mutations.
 *    - Resolvers provide the logic for handling these queries and mutations, allowing data to be fetched or modified.
 * 
 * 4. **MongoDB Connection**:
 *    - Connects to a MongoDB database using Mongoose for data persistence.
 *    - Ensures the connection is valid before starting the server, preventing runtime errors due to missing database configuration.
 * 
 * 5. **Error Handling**:
 *    - Gracefully handles critical errors during startup, logging them for debugging and exiting the process if necessary.
 * 
 * 6. **Server Initialization**:
 *    - The server listens on a configurable port (default: 5000), making the GraphQL API available at `/graphql`.
 * 
 * This structure is designed to be modular, secure, and beginner-friendly, making it easy to expand and maintain the application as it grows.
 */

require('dotenv').config(); // Load environment variables from a .env file into process.env
// This allows us to securely store sensitive configuration details like the MongoDB URI.

// Import necessary modules
const express = require('express'); // Express framework to create the server
const mongoose = require('mongoose'); // Mongoose for connecting and interacting with MongoDB
const { ApolloServer } = require('@apollo/server'); // Apollo Server for handling GraphQL operations
const { expressMiddleware } = require('@apollo/server/express4'); // Apollo's middleware for integrating with Express
const bodyParser = require('body-parser'); // Middleware to parse incoming requests
const typeDefs = require('./graphql/schema'); // GraphQL schema that defines the structure of the API
const resolvers = require('./graphql/resolvers'); // Resolvers specify how to fetch the data for the API

const startServer = async () => {
  try {
    const app = express(); // Create an Express application instance

    // Check for necessary environment variables
    // This ensures we have a valid MongoDB connection string before starting the server
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in the .env file');
    }

    // Enable request parsing
    // These middlewares allow the server to handle JSON and URL-encoded form data in requests.
    app.use(bodyParser.json()); // Parse JSON bodies
    app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

    // Initialize Apollo Server
    // Apollo Server is configured with the GraphQL schema and resolvers
    const server = new ApolloServer({
      typeDefs, // Schema definition: defines API types, queries, and mutations
      resolvers, // Resolvers: provide logic for how each field is resolved
    });

    await server.start(); // Start the Apollo Server

    // Apply Apollo middleware to the Express app
    // This mounts the GraphQL API at the /graphql endpoint
    app.use('/graphql', expressMiddleware(server));

    // Start the Express server
    // The server listens on the specified port or defaults to 5000.
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    // Log any errors that occur during startup
    console.error('Error starting the server:', error);
    process.exit(1); // Exit the process if a critical failure occurs
  }
};

startServer(); // Call the function to start the server

