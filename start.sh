# start.sh

# Activate virtual environment
source .venv/bin/activate  # Adjust if your venv folder is `venv`

# Start Flask backend
python src/backend/app.py &

# Start Vite frontend
npm run dev &

# Start MongoDB if not running as a service
mongod &