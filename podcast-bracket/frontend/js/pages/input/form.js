import { showSuccessMessage, showErrorMessage, collectFormData } from '../../common/utils.js';
import { HostManager } from './hosts.js';
import { MatchupManager } from './matchups.js';

export const initializeInputPage = () => {
    const form = document.getElementById('episodeForm');
    if (!form) return;

    const hostManager = new HostManager();
    const matchupManager = new MatchupManager(hostManager);

    setupFormSubmission(form, hostManager, matchupManager);
};

const setupFormSubmission = (form, hostManager, matchupManager) => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const formData = collectFormData(form);
            const episodeData = {
                ...formData,
                matchups: matchupManager.getMatchupsData(formData)
            };

            console.log('Episode data to submit:', episodeData);
            // TODO: Add API call when backend is ready
            
            showSuccessMessage('Episode added successfully!');
            form.reset();
            hostManager.reset();
            matchupManager.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            showErrorMessage('Failed to add episode. Please try again.');
        }
    });
};