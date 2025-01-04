#!/bin/bash

# Find and terminate MongoDB running on port 27017
if lsof -ti :27017 >/dev/null; then
  echo "Stopping MongoDB..."
  lsof -ti :27017 | xargs kill -9
else
  echo "MongoDB is not running."
fi

# Find and terminate Flask backend running on port 5001
if lsof -ti :5001 >/dev/null; then
  echo "Stopping Flask backend..."
  lsof -ti :5001 | xargs kill -9
else
  echo "Flask backend is not running."
fi

# Find and terminate Vite frontend running on port 5173 or others
if lsof -ti :5173 >/dev/null; then
  echo "Stopping Vite frontend on port 5173..."
  lsof -ti :5173 | xargs kill -9
elif lsof -ti :5174 >/dev/null; then
  echo "Stopping Vite frontend on port 5174..."
  lsof -ti :5174 | xargs kill -9
else
  echo "Vite frontend is not running."
fi

echo "All services have been stopped."