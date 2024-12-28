export class MatchupManager {
    constructor(hostManager) {
        this.matchupsContainer = document.getElementById('matchupsContainer');
        this.addMatchupBtn = document.getElementById('addMatchupBtn');
        this.hostManager = hostManager;
        this.matchupCounter = 1;
        this.initialize();
    }

    initialize() {
        if (this.addMatchupBtn) {
            this.addMatchupBtn.addEventListener('click', () => this.addMatchup());
        }
        if (this.matchupsContainer) {
            this.matchupsContainer.addEventListener('click', (e) => this.handleMatchupRemoval(e));
        }

        // Listen for host changes to update vote fields
        document.addEventListener('hostsChanged', () => this.updateAllVoteFields());

        // Initialize vote fields for first matchup
        this.updateAllVoteFields();
    }

    addMatchup() {
        this.matchupCounter++;
        const matchup = document.createElement('div');
        matchup.className = 'matchup-container bg-gray-50 rounded-lg p-4';
        matchup.dataset.matchupId = this.matchupCounter;
        
        matchup.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <h3 class="font-medium">Matchup ${this.matchupCounter}</h3>
                <button type="button" class="remove-matchup text-red-600 hover:text-red-700 text-sm">
                    Remove
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Player 1</label>
                    <input type="text" name="matchup${this.matchupCounter}_player1" required 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Player 2</label>
                    <input type="text" name="matchup${this.matchupCounter}_player2" required
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>
            </div>
            <div class="votes-section">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Votes</h4>
                <div class="votes-container space-y-2"></div>
            </div>
        `;
        
        this.matchupsContainer.appendChild(matchup);
        this.updateVoteFields(matchup);
    }

    handleMatchupRemoval(event) {
        if (event.target.classList.contains('remove-matchup')) {
            const matchup = event.target.closest('.matchup-container');
            if (this.matchupsContainer.children.length > 1) {
                matchup.remove();
                this.updateMatchupNumbers();
            }
        }
    }

    updateMatchupNumbers() {
        const matchups = this.matchupsContainer.querySelectorAll('.matchup-container');
        matchups.forEach((matchup, index) => {
            const number = index + 1;
            matchup.querySelector('h3').textContent = `Matchup ${number}`;
            matchup.dataset.matchupId = number;

            // Update input names
            const inputs = matchup.querySelectorAll('input[type="text"]');
            inputs[0].name = `matchup${number}_player1`;
            inputs[1].name = `matchup${number}_player2`;
        });
        this.updateAllVoteFields();
    }

    updateVoteFields(matchupContainer) {
        const hosts = this.hostManager.getHosts();
        const votesContainer = matchupContainer.querySelector('.votes-container');
        const matchupId = matchupContainer.dataset.matchupId;
        
        votesContainer.innerHTML = '';
        
        hosts.forEach((host, index) => {
            const voteGroup = document.createElement('div');
            voteGroup.className = 'flex items-center space-x-4';
            voteGroup.innerHTML = `
                <span class="text-sm text-gray-600 w-32">${host || `Host ${index + 1}`}</span>
                <label class="inline-flex items-center">
                    <input type="radio" name="vote_${matchupId}_host_${index}" value="player1" required
                           class="text-blue-600 focus:ring-blue-500">
                    <span class="ml-2">Player 1</span>
                </label>
                <label class="inline-flex items-center">
                    <input type="radio" name="vote_${matchupId}_host_${index}" value="player2" required
                           class="text-blue-600 focus:ring-blue-500">
                    <span class="ml-2">Player 2</span>
                </label>
            `;
            votesContainer.appendChild(voteGroup);
        });
    }

    updateAllVoteFields() {
        this.matchupsContainer.querySelectorAll('.matchup-container').forEach(matchup => {
            this.updateVoteFields(matchup);
        });
    }

    getMatchupsData(formData) {
        const matchups = [];
        const matchupElements = this.matchupsContainer.querySelectorAll('.matchup-container');

        matchupElements.forEach(matchup => {
            const matchupId = matchup.dataset.matchupId;
            const matchupData = {
                players: [
                    formData[`matchup${matchupId}_player1`],
                    formData[`matchup${matchupId}_player2`]
                ],
                votes: []
            };

            // Get votes for each host
            this.hostManager.getHosts().forEach((host, index) => {
                const vote = formData[`vote_${matchupId}_host_${index}`];
                matchupData.votes.push({
                    host,
                    vote: vote === 'player1' ? 0 : 1 // 0 for player1, 1 for player2
                });
            });

            matchups.push(matchupData);
        });

        return matchups;
    }

    reset() {
        // Keep first matchup but clear its inputs
        const firstMatchup = this.matchupsContainer.querySelector('.matchup-container');
        if (firstMatchup) {
            firstMatchup.querySelectorAll('input[type="text"]').forEach(input => input.value = '');
            firstMatchup.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
            
            // Remove all other matchups
            Array.from(this.matchupsContainer.children)
                .slice(1)
                .forEach(child => child.remove());
        }
        this.matchupCounter = 1;
        this.updateAllVoteFields();
    }
}