#!/bin/bash

# Define data directory for MongoDB
MONGO_DBPATH=~/mongodb-data

# Ensure MongoDB data directory exists
if [ ! -d "$MONGO_DBPATH" ]; then
  echo "Creating MongoDB data directory at $MONGO_DBPATH..."
  mkdir -p "$MONGO_DBPATH"
  chmod 700 "$MONGO_DBPATH"
fi

# Start MongoDB
echo "Starting MongoDB..."
mongod --dbpath "$MONGO_DBPATH" --port 27017 >/dev/null 2>&1 &
sleep 3
if lsof -ti :27017 >/dev/null; then
  echo "MongoDB started successfully on port 27017."
else
  echo "Failed to start MongoDB. Check logs for details."
  exit 1
fi

# Start Flask backend
echo "Starting Flask backend..."
python3 app.py >/dev/null 2>&1 &
sleep 3
if lsof -ti :5000 >/dev/null; then
  echo "Flask backend started successfully on port 5000."
else
  echo "Failed to start Flask backend. Check logs for details."
  exit 1
fi

# Start Vite frontend
echo "Starting Vite frontend..."
npm run dev >/dev/null 2>&1 &
sleep 3
if lsof -ti :5173 >/dev/null || lsof -ti :5174 >/dev/null; then
  echo "Vite frontend started successfully."
else
  echo "Failed to start Vite frontend. Check logs for details."
  exit 1
fi

echo "All services started successfully!"