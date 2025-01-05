#!/bin/bash

# Usage:
# Run `bash end.sh` to stop all running services.
# This stops MongoDB, Apollo Server, Flask backend, and the Vite frontend.

# Define colors
RED='\033[0;31m'      # Red for errors
GREEN='\033[0;32m'    # Green for success
YELLOW='\033[0;33m'   # Yellow for warnings
BLUE='\033[0;34m'     # Blue for info
NC='\033[0m'          # No color

# Stop Vite frontend
echo -e "${BLUE}🌐 Checking Vite frontend...${NC}"
if pgrep -f "vite" >/dev/null; then
  echo -e "${BLUE}🌐 Stopping Vite frontend...${NC}"
  pkill -f "vite"
  echo -e "${GREEN}🌐 Vite frontend stopped.${NC}"
else
  echo -e "${YELLOW}🌐 Vite frontend is not running.${NC}"
fi

# Stop Flask backend
echo -e "${BLUE}🐍 Checking Flask backend...${NC}"
if pgrep -f "python3 /Users/christopherholland/DiaryRoom/src/backend/app.py" >/dev/null; then
  echo -e "${BLUE}🐍 Stopping Flask backend...${NC}"
  pkill -f "python3 /Users/christopherholland/DiaryRoom/src/backend/app.py"
  echo -e "${GREEN}🐍 Flask backend stopped.${NC}"
else
  echo -e "${YELLOW}🐍 Flask backend is not running.${NC}"
fi

# Stop Apollo Server
echo -e "${BLUE}🚀 Checking Apollo Server...${NC}"
if pgrep -f "node /Users/christopherholland/DiaryRoom/src/backend/index.js" >/dev/null; then
  echo -e "${BLUE}🚀 Stopping Apollo Server...${NC}"
  pkill -f "node /Users/christopherholland/DiaryRoom/src/backend/index.js"
  echo -e "${GREEN}🚀 Apollo Server stopped.${NC}"
else
  echo -e "${YELLOW}🚀 Apollo Server is not running.${NC}"
fi

# Stop MongoDB
echo -e "${BLUE}🗄️ Checking MongoDB...${NC}"
if pgrep -f "mongod --dbpath" >/dev/null; then
  echo -e "${BLUE}🗄️ Stopping MongoDB...${NC}"
  pkill -f "mongod --dbpath"
  echo -e "${GREEN}🗄️ MongoDB stopped.${NC}"
else
  echo -e "${YELLOW}🗄️ MongoDB is not running.${NC}"
fi

echo -e "${GREEN}✨ All services stopped successfully!${NC}"