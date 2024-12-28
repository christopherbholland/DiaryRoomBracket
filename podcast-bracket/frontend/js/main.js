//main.js
// Common functionality across pages
const initializeApp = () => {
    setupMobileMenu();
    setupPageSpecificBehavior();
};

const setupMobileMenu = () => {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
};

const setupPageSpecificBehavior = () => {
    const currentPage = window.location.pathname.split('/').pop();

    switch (currentPage) {
        case 'bracket.html':
            initializeBracketPage();
            break;
        case 'episodes.html':
            initializeEpisodesPage();
            break;
        case 'input.html':
            initializeInputPage();
            break;
    }
};

// Bracket page functionality
const initializeBracketPage = () => {
    // We'll implement this in Phase 3.1
    console.log('Bracket page initialized');
};

// Episodes page functionality
const initializeEpisodesPage = () => {
    // We'll implement this in Phase 3.2
    console.log('Episodes page initialized');
};

// Input form functionality
const initializeInputPage = () => {
    const form = document.querySelector('form');
    if (form) {
        setupFormValidation(form);
        setupDynamicMatchups();
    }
};

const setupFormValidation = (form) => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validateForm(form)) {
            const formData = collectFormData(form);
            try {
                // We'll implement the API call in Phase 4.1
                console.log('Form data:', formData);
                showSuccessMessage('Episode added successfully!');
            } catch (error) {
                showErrorMessage('Failed to add episode. Please try again.');
            }
        }
    });
};

const validateForm = (form) => {
    // Basic form validation
    const required = form.querySelectorAll('[required]');
    let isValid = true;

    required.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            showFieldError(field, 'This field is required');
        } else {
            clearFieldError(field);
        }
    });

    return isValid;
};

const collectFormData = (form) => {
    const formData = new FormData(form);
    const data = {
        title: formData.get('title'),
        number: parseInt(formData.get('episode_number')),
        youtube_link: formData.get('youtube_link'),
        hosts: formData.get('hosts').split(',').map(host => host.trim()),
        guest: formData.get('guest'),
        matchups: []
    };

    // Collect matchup data
    const matchupContainers = form.querySelectorAll('.matchup-container');
    matchupContainers.forEach(container => {
        const matchup = {
            players: [
                formData.get(`${container.id}_player1`),
                formData.get(`${container.id}_player2`)
            ],
            votes: [
                parseInt(formData.get(`${container.id}_votes1`)),
                parseInt(formData.get(`${container.id}_votes2`))
            ]
        };
        data.matchups.push(matchup);
    });

    return data;
};

const setupDynamicMatchups = () => {
    // We'll implement this in Phase 3.3
    console.log('Dynamic matchups initialized');
};

// Utility functions for messages
const showSuccessMessage = (message) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg fade-in';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
};

const showErrorMessage = (message) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded shadow-lg fade-in';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
};

const showFieldError = (field, message) => {
    const errorDiv = field.parentElement.querySelector('.error-message') || 
        document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    if (!field.parentElement.querySelector('.error-message')) {
        field.parentElement.appendChild(errorDiv);
    }
    field.classList.add('border-red-500');
};

const clearFieldError = (field) => {
    const errorDiv = field.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.classList.remove('border-red-500');
};

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);