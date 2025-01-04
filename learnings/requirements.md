# Podcast Bracket Tracker

## Project Overview
A web application for tracking and visualizing podcast brackets, managing episodes, hosts, and matchups.

## Architecture

### Frontend Structure
```
frontend/
├── index.html          # Landing page
├── bracket.html        # Bracket visualization
├── episodes.html       # Episodes listing
├── input.html         # Episode input form
├── css/
│   └── main.css       # Tailwind CSS
└── js/
    ├── common/        # Shared utilities
    ├── pages/         # Page-specific logic
    └── main.js        # Entry point
```

### Module Responsibilities

#### Common Modules
- `navigation.js`: Mobile menu and navigation logic
- `utils.js`: Shared utility functions

#### Page-Specific Modules
- Input Form (`pages/input/`)
  - `form.js`: Main form handling and validation
  - `hosts.js`: Host management (add, remove, update)
  - `matchups.js`: Matchup tracking and vote management

## Data Structures

### Episode Data
```javascript
{
  id: string,
  title: string,
  date: string,
  hosts: Host[],
  matchups: Matchup[]
}
```

### Host Data
```javascript
{
  id: string,
  name: string,
  votes: number
}
```

### Matchup Data
```javascript
{
  id: string,
  contestant1: Host,
  contestant2: Host,
  winner: Host | null
}
```

## Implementation Status

### Completed Features
- ✅ Project structure and module system
- ✅ Mobile-responsive navigation
- ✅ Episode input form
- ✅ Host management
- ✅ Matchup tracking
- ✅ Form validation

### In Progress
- 🚧 Bracket visualization
- 🚧 Episodes listing
- 🚧 Backend integration
- 🚧 Data persistence

## Development Guidelines

### Code Organization
1. Keep modules focused and single-responsibility
2. Use ES6 module syntax for imports/exports
3. Maintain separation between UI and data logic
4. Document complex functions and data structures
5. Use consistent naming conventions

### State Management
1. Each page handles its own state
2. Common state shared through utility functions
3. Form state managed in respective modules
4. Use events for cross-module communication

### Error Handling
1. Validate all user inputs
2. Provide clear error messages
3. Handle edge cases gracefully
4. Log errors appropriately

## Next Steps

### Priority 1: Core Features
- [ ] Implement bracket visualization
- [ ] Create episodes listing page
- [ ] Add data persistence
- [ ] Set up basic backend integration

### Priority 2: Enhancements
- [ ] Add search and filtering
- [ ] Implement sorting options
- [ ] Add export functionality
- [ ] Enhance mobile experience

## Notes for AI Collaboration
1. Reference specific file paths when discussing changes
2. Break down complex features into smaller tasks
3. Focus on one module/feature at a time
4. Maintain documentation as changes are made

