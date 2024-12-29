// Import modules
import { initializeNavigation } from '../common/navigation.js';

// Import page-specific initializers
// Note: We'll create these other files when we implement those pages
// import { initializeBracketPage } from './pages/bracket/bracket.js';
// import { initializeEpisodesPage } from './pages/episodes/episodes.js';
import { initializeInputPage } from './pages/input/form.js';

// Get current page name from URL
const getCurrentPage = () => {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
};

// Initialize page-specific functionality
const initializePageContent = () => {
    const currentPage = getCurrentPage();
    console.log(`Current Page: ${currentPage}`); // Debug current page

    switch (currentPage) {
        case 'bracket.html':
            console.log('Bracket page - to be implemented');
            break;
        case 'episodes.html':
            console.log('Episodes page - to be implemented');
            break;
        case 'input.html':
            console.log('Initializing Input Page');
            initializeInputPage();
            break;
        default:
            console.log('Home page or unknown page');
    }
};

// Initialize the app
const initializeApp = () => {
    // Initialize common features
    initializeNavigation();

    // Initialize page-specific content
    initializePageContent();
};

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);