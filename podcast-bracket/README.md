# Diary Room Bracket Tracker

A web application to track podcast bracket competitions, display matchups, and manage episode data.

## Project Setup

### Backend Setup
1. Create and activate virtual environment:
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

2. Install dependencies:
cd backend
pip install -r requirements.txt

3. Run the Flask server:
python app.py

### Frontend Setup
1. Open frontend/index.html in your browser
2. For development, use a local server:
python -m http.server 8000

## Project Structure
podcast-bracket/
├── backend/
│   ├── app.py           # Flask application
│   ├── data.json        # Data storage
│   └── requirements.txt # Python dependencies
├── frontend/
│   ├── index.html      # Main HTML file
│   ├── css/            # Stylesheets
│   └── js/             # JavaScript files
└── README.md

## Features
- Dynamic bracket visualization
- Episode list with YouTube links
- Episode data input form

## API Endpoints
- GET /players - Returns player data
- GET /bracket - Returns bracket data
- GET /episodes - Returns episode list
- POST /episodes - Add new episode data

## Development
- Backend: http://localhost:5000
- Frontend: Load index.html directly or via local server