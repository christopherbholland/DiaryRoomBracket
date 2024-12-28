document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('episodeForm');
    const addHostBtn = document.getElementById('addHostBtn');
    const hostsList = document.getElementById('hostsList');
    const addMatchupBtn = document.getElementById('addMatchupBtn');
    const matchupsContainer = document.getElementById('matchupsContainer');

    let matchupCounter = 0;

    // Add Host
    addHostBtn.addEventListener('click', () => {
        const hostInput = document.createElement('div');
        hostInput.className = 'host-input flex gap-2';
        hostInput.innerHTML = `
            <input type="text" name="hosts[]" required placeholder="Enter host name"
                   class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <button type="button" class="remove-host text-red-600 hover:text-red-700 px-2">
                ×
            </button>
        `;
        hostInput.querySelector('.remove-host').addEventListener('click', () => hostInput.remove());
        hostsList.appendChild(hostInput);
    });

    // Add Matchup
    addMatchupBtn.addEventListener('click', () => {
        matchupCounter++;
        const matchup = document.createElement('div');
        matchup.className = 'matchup-container bg-gray-50 rounded-lg p-4';
        matchup.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <h3 class="font-medium">Matchup ${matchupCounter}</h3>
                <button type="button" class="remove-matchup text-red-600 hover:text-red-700 text-sm">
                    Remove
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Player 1</label>
                    <input type="text" name="matchup${matchupCounter}_player1" required 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Player 2</label>
                    <input type="text" name="matchup${matchupCounter}_player2" required
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>
            </div>
        `;
        matchup.querySelector('.remove-matchup').addEventListener('click', () => matchup.remove());
        matchupsContainer.appendChild(matchup);
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log('Form Data:', data);
        alert('Episode submitted successfully!');
        form.reset();
        hostsList.innerHTML = '<div class="host-input flex gap-2"><input type="text" name="hosts[]" required placeholder="Enter host name" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></div>';
        matchupsContainer.innerHTML = '';
        matchupCounter = 0;
    });
});