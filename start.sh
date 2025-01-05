#!/bin/bash

# Usage:
# Run `bash start.sh` to start all services.
# Logs are stored in ~/DiaryRoom/logs.
# Run `bash end.sh` to stop all services.

# Define colors
RED='\033[0;31m'      # Red for errors
GREEN='\033[0;32m'    # Green for success
YELLOW='\033[0;33m'   # Yellow for warnings
BLUE='\033[0;34m'     # Blue for info
NC='\033[0m'          # No color

LOG_DIR=~/DiaryRoom/logs
MONGO_DBPATH=~/mongodb-data

# Ensure logs directory exists
mkdir -p "$LOG_DIR"

# Ensure MongoDB data directory exists
if [ ! -d "$MONGO_DBPATH" ]; then
  echo -e "${BLUE}🗄️ Creating MongoDB data directory at $MONGO_DBPATH...${NC}"
  mkdir -p "$MONGO_DBPATH"
  chmod 700 "$MONGO_DBPATH"
fi

# Start MongoDB
if pgrep -f "mongod --dbpath" >/dev/null; then
  echo -e "${YELLOW}🗄️ MongoDB is already running.${NC}"
else
  echo -e "${BLUE}🗄️ Starting MongoDB...${NC}"
  mongod --dbpath "$MONGO_DBPATH" --port 27017 >"$LOG_DIR/mongodb.log" 2>&1 &
  sleep 3
  if lsof -ti :27017 >/dev/null; then
    echo -e "${GREEN}🗄️ MongoDB started successfully on port 27017.${NC}"
  else
    echo -e "${RED}🗄️ Failed to start MongoDB. Check $LOG_DIR/mongodb.log for details.${NC}"
    exit 1
  fi
fi

# Start Apollo Server
if pgrep -f "node /Users/christopherholland/DiaryRoom/src/backend/index.js" >/dev/null; then
  echo -e "${YELLOW}🚀 Apollo Server is already running.${NC}"
else
  echo -e "${BLUE}🚀 Starting Apollo Server...${NC}"
  node /Users/christopherholland/DiaryRoom/src/backend/index.js >"$LOG_DIR/apollo.log" 2>&1 &
  sleep 3
  if lsof -ti :5001 >/dev/null; then
    echo -e "${GREEN}🚀 Apollo Server started successfully on port 5001.${NC}"
  else
    echo -e "${RED}🚀 Failed to start Apollo Server. Check $LOG_DIR/apollo.log for details.${NC}"
    exit 1
  fi
fi

# Start Flask backend
if pgrep -f "python3 /Users/christopherholland/DiaryRoom/src/backend/app.py" >/dev/null; then
  echo -e "${YELLOW}🐍 Flask backend is already running.${NC}"
else
  echo -e "${BLUE}🐍 Starting Flask backend...${NC}"
  python3 /Users/christopherholland/DiaryRoom/src/backend/app.py >"$LOG_DIR/flask.log" 2>&1 &
  sleep 3
  if lsof -ti :5000 >/dev/null; then
    echo -e "${GREEN}🐍 Flask backend started successfully on port 5000.${NC}"
  else
    echo -e "${RED}🐍 Failed to start Flask backend. Check $LOG_DIR/flask.log for details.${NC}"
    exit 1
  fi
fi

# Start Vite frontend
if pgrep -f "npm run dev" >/dev/null; then
  echo -e "${YELLOW}🌐 Vite frontend is already running.${NC}"
else
  echo -e "${BLUE}🌐 Starting Vite frontend...${NC}"
  npm run dev >"$LOG_DIR/vite.log" 2>&1 &
  sleep 3
  if lsof -ti :5173 >/dev/null || lsof -ti :5174 >/dev/null; then
    echo -e "${GREEN}🌐 Vite frontend started successfully.${NC}"
  else
    echo -e "${RED}🌐 Failed to start Vite frontend. Check $LOG_DIR/vite.log for details.${NC}"
    exit 1
  fi
fi

echo -e "${GREEN}✨ All services started successfully!${NC}"