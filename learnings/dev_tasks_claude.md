# Development Tasks for Podcast Bracket Tracker

## Phase 1: Project Setup and Basic Structure

### 1.1 Backend Setup
1. Create a new Flask project with virtual environment
2. Set up basic project structure:
   ```
   podcast-bracket/
   ├── backend/
   │   ├── app.py
   │   ├── data.json
   │   └── requirements.txt
   ├── frontend/
   │   ├── index.html
   │   ├── css/
   │   └── js/
   └── README.md
   ```
3. Initialize Git repository
4. Create initial data.json with sample data for testing

### 1.2 Frontend Foundation
1. Create basic HTML structure with placeholder pages
2. Set up Tailwind CSS configuration
3. Create basic navigation between pages

## Phase 2: Core Backend Development

### 2.1 Data Model Implementation
1. Create initial data.json structure for:
   - Players
   - Bracket structure
   - Episodes
2. Implement data validation functions

### 2.2 API Endpoints
1. Implement GET /players endpoint
2. Implement GET /bracket endpoint
3. Implement GET /episodes endpoint
4. Add basic error handling
5. Implement CORS support for local development

### 2.3 Data Management
1. Implement POST /episodes endpoint
2. Create utility functions for updating data.json
3. Add validation for incoming episode data

## Phase 3: Frontend Features

### 3.1 Bracket Visualization
1. Create basic bracket layout structure
2. Implement bracket rendering logic
3. Add player information display
4. Style matchup containers
5. Implement winner highlighting

### 3.2 Episode List
1. Create episode list component
2. Implement episode card design
3. Add YouTube link integration
4. Style episode cards
5. Add sorting/filtering capabilities

### 3.3 Episode Input Form
1. Create form HTML structure
2. Implement form validation
3. Add dynamic matchup input fields
4. Create form submission handler
5. Add success/error messaging

## Phase 4: Integration and Enhancement

### 4.1 API Integration
1. Create frontend API service
2. Implement data fetching for bracket
3. Implement data fetching for episodes
4. Add loading states
5. Implement error handling

### 4.2 State Management
1. Implement basic state management
2. Add data refresh logic
3. Create local storage cache

### 4.3 UI/UX Improvements
1. Add responsive design
2. Implement loading animations
3. Add error state displays
4. Improve navigation experience
5. Add basic animations

## Phase 5: Testing and Deployment

### 5.1 Testing
1. Test all API endpoints
2. Verify form submission
3. Test bracket visualization
4. Cross-browser testing
5. Mobile responsiveness testing

### 5.2 Deployment Preparation
1. Set up GitHub repository
2. Create deployment configuration for Render
3. Set up GitHub Pages
4. Configure environment variables

### 5.3 Initial Deployment
1. Deploy backend to Render
2. Deploy frontend to GitHub Pages
3. Update API endpoints for production
4. Test deployed application
5. Document deployment process

# Requirements Document

## Project Overview

This project involves creating a lightweight website to track a podcast bracket competition. It includes a bracket to visualize player matchups, an episode list with YouTube links, and an input form to manage episode data. The stack should prioritize simplicity, cost-effectiveness, and ease of coding for a beginner.

## Core Features

### 1. Bracket Visualization
- Display a dynamically generated bracket that scales with the number of players and rounds
- Include details for each player:
  - Name
  - Seasons
  - HOH Wins
  - Veto Wins
  - Times Nominated
  - Placement
  - Notes
- Show matchups and votes for each round
- Dynamically calculate and highlight players who advance based on votes

### 2. Episode List
- List all episodes with:
  - Episode number
  - Title
  - Hosts and special guest
  - Matchups and votes
  - YouTube link
- Allow users to navigate through episodes easily

### 3. Episode Input Form
- Collect details for a new episode:
  - Episode Title
  - Episode Number
  - YouTube Link
  - Hosts
  - Special Guest
  - Three matchups (player names and votes)
- Submit the data to the backend to update the bracket and episode list

## Stack Choices

### Frontend
- HTML/CSS/JavaScript: Use plain HTML, CSS, and JavaScript for simplicity
- Hosting: Use GitHub Pages (free and beginner-friendly)
- CSS Framework: Tailwind CSS for responsive design (optional, or stick to plain CSS)

### Backend
- Framework: Flask (Python) for ease of use and minimal setup
- Data Storage: JSON file for simplicity and cost-effectiveness (no database needed)
- Hosting: Use Render (free tier for Flask apps) or deploy locally during development

## Detailed Requirements

### 1. Bracket Visualization

#### User Stories
- As a user, I want to see the full bracket with all matchups and rounds
- As a user, I want to see player stats in the bracket
- As a user, I want to know which players advanced in each matchup

#### Functionality
- Dynamically display the bracket based on a JSON structure
- Show player stats (name, seasons, HOH wins, veto wins, nominations, placement, notes)
- Highlight players who advanced

#### Example JSON Structure

```json
{
  "players": [
    {
      "name": "Player 1",
      "seasons": ["BB10"],
      "hoh_wins": 2,
      "veto_wins": 1,
      "times_nominated": 3,
      "placement": "Winner",
      "notes": "Strategic mastermind"
    }
  ],
  "bracket": [
    {
      "round": 1,
      "matchups": [{
        "players": ["Player 1", "Player 2"],
        "votes": [2, 1]
      }]
    }
  ]
}
```

#### API Endpoints
1. GET /bracket: Returns bracket data
2. GET /players: Returns player data

### 2. Episode List

#### User Stories
- As a user, I want to see a list of episodes with details
- As a user, I want to click a link to watch the episode on YouTube

#### Functionality
- Display all episodes with:
  - Episode number
  - Title
  - Hosts and special guest
  - Matchups and votes
  - YouTube link

#### Example JSON Structure

```json
{
  "episodes": [
    {
      "number": 1,
      "title": "Episode 1: The Beginning",
      "hosts": ["Host A", "Host B"],
      "guest": "Guest C",
      "matchups": [
        {
          "players": ["Player 1", "Player 2"],
          "votes": [2, 1]
        },
        {
          "players": ["Player 3", "Player 4"],
          "votes": [0, 3]
        }
      ],
      "youtube_link": "https://www.youtube.com/watch?v=example"
    }
  ]
}
```

#### API Endpoints
1. GET /episodes: Returns episode data

### 3. Episode Input Form

#### User Stories
- As an admin, I want to enter details for a new episode to update the bracket and episode list

#### Functionality
- Input form with:
  - Episode Title
  - Episode Number
  - YouTube Link
  - Hosts
  - Special Guest
  - Matchups (3, each with two players and their votes)
- Submit data to the backend

#### Example Form Submission

```json
{
  "title": "Episode 1: The Beginning",
  "number": 1,
  "youtube_link": "https://www.youtube.com/watch?v=example",
  "hosts": ["Host A", "Host B"],
  "guest": "Guest C",
  "matchups": [
    {
      "players": ["Player 1", "Player 2"],
      "votes": [2, 1]
    },
    {
      "players": ["Player 3", "Player 4"],
      "votes": [0, 3]
    }
  ]
}
```

#### API Endpoint
1. POST /episodes: Adds a new episode and updates the JSON file

## Development Plan

### Phase 1: Backend
1. Set up a Flask app
2. Create endpoints:
   - GET /players
   - GET /bracket
   - GET /episodes
   - POST /episodes
3. Store data in a local data.json file

### Phase 2: Frontend
1. Bracket Page:
   - Fetch and display data from GET /bracket
   - Show matchups and player details
2. Episode List Page:
   - Fetch and display data from GET /episodes
   - Include clickable YouTube links
3. Episode Input Form:
   - Build a form to collect episode details
   - Submit data to POST /episodes

### Phase 3: Deployment
1. Deploy the backend to Render
2. Host the frontend on GitHub Pages