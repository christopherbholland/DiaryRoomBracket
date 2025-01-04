Here’s a complete README.md file combining the current state of your project and the setup instructions:

DiaryRoom

DiaryRoom is a project combining a Flask backend and a Vite-powered frontend, integrated with MongoDB for database management. This guide explains how to set up, run, and maintain the project.

Project Structure

.
├── learnings/              # Documentation and notes
│   ├── dev_tasks.md
│   ├── dev_tasks_claude.md
│   ├── input.md
│   ├── requirements.md
│   └── requirements_detailed.md
├── node_modules/           # JavaScript dependencies (auto-generated)
├── requirements.txt        # Python dependencies for the backend
├── src/                    # Application source code
│   ├── assets/             # Static files (e.g., styles, images)
│   ├── backend/            # Backend logic (Flask app)
│   ├── counter.js          # Frontend JS module
│   ├── main.js             # Vite entry point
│   └── pages/              # Frontend views or components
└── start.sh                # Script to start the project

Setup Instructions

1. Prerequisites

Ensure the following tools are installed on your system:
	•	Python 3.8 or higher
	•	Node.js 16 or higher
	•	MongoDB 6.0 or higher
	•	Homebrew (for macOS users)

2. Setting Up the Virtual Environment
	1.	Navigate to the project directory:

cd /Users/christopherholland/DiaryRoom


	2.	Create and activate a virtual environment:
	•	macOS/Linux:

python3 -m venv .venv
source .venv/bin/activate


	•	Windows (PowerShell):

python -m venv .venv
.\.venv\Scripts\Activate


	3.	Install backend dependencies:

pip install -r requirements.txt

3. Installing Frontend Dependencies
	1.	Navigate to the project root and install Node.js dependencies:

npm install


	2.	Add the following scripts to your package.json if they are missing:

{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview"
  }
}

4. Starting the Project

Use the provided start.sh script to start all services:

start.sh

# start.sh

# Activate virtual environment
source .venv/bin/activate  # Adjust if your venv folder is `venv`

# Start Flask backend
python src/backend/app.py &

# Start Vite frontend
npm run dev &

# Start MongoDB if not running as a service
mongod &

Run the script:

bash start.sh

5. Verifying the Setup
	1.	Flask Backend:
	•	Access the backend at:

http://localhost:5000


	•	Modify app.py to use a different port if needed:

app.run(port=5001)


	2.	Vite Frontend:
	•	Access the frontend at:

http://localhost:3000


	3.	MongoDB:
	•	Ensure MongoDB is running using:

mongo --eval "db.runCommand({ connectionStatus: 1 })"

Troubleshooting

Virtual Environment Issues
	•	If venv/bin/activate is not found:

python3 -m venv .venv
source .venv/bin/activate



Port 5000 Is Already in Use
	•	Find and terminate the process using port 5000:

lsof -i :5000
kill -9 <PID>



MongoDB Not Found
	•	Install MongoDB using Homebrew:

brew tap mongodb/brew
brew install mongodb-community@6.0

Current State of the Project
	•	Backend: Flask is set up with a virtual environment.
	•	Frontend: Vite is configured, but the dev script might need verification in package.json.
	•	Database: MongoDB is not yet installed or configured properly. Ensure it is running for full functionality.
	•	Project Scripts: start.sh automates the startup process for all services.

Future Improvements
	•	Automate the MongoDB setup as part of the start.sh script.
	•	Add detailed instructions for deploying the app in a production environment.
	•	Implement error handling for scripts and services.
