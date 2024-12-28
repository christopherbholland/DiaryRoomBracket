document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('episodeForm');
    const addHostBtn = document.getElementById('addHostBtn');
    const hostsList = document.getElementById('hostsList');
    const addMatchupBtn = document.getElementById('addMatchupBtn');
    const matchupsContainer = document.getElementById('matchupsContainer');

    const defaultHosts = ['Aman', 'Matt'];
    let hosts = [...defaultHosts];
    let matchupCounter = 0;

    // Render initial hosts
    const renderHosts = () => {
        hostsList.innerHTML = '';
        hosts.forEach((host, index) => {
            const hostDiv = document.createElement('div');
            hostDiv.className = 'flex gap-2 items-center';
            hostDiv.innerHTML = `
                <input type="text" value="${host}" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500" required>
                ${index >= 2
                    ? '<button type="button" class="text-red-600 hover:text-red-700 px-2">Remove</button>'
                    : ''}
            `;
            if (index >= 2) {
                hostDiv.querySelector('button').addEventListener('click', () => {
                    hosts.splice(index, 1);
                    renderHosts();
                });
            }
            hostDiv.querySelector('input').addEventListener('input', (e) => {
                hosts[index] = e.target.value;
            });
            hostsList.appendChild(hostDiv);
        });
    };

    // Add a new host
    addHostBtn.addEventListener('click', () => {
        hosts.push('');
        renderHosts();
    });

    // Add a new matchup
    addMatchupBtn.addEventListener('click', () => {
        matchupCounter++;
        const matchupDiv = document.createElement('div');
        matchupDiv.className = 'matchup bg-gray-50 p-4 rounded-lg shadow-sm space-y-4';
        matchupDiv.dataset.matchupId = matchupCounter;

        matchupDiv.innerHTML = `
            <div class="flex justify-between items-center">
                <h3 class="font-medium text-lg">Matchup ${matchupCounter}</h3>
                <button type="button" class="remove-matchup text-red-600 hover:text-red-700 text-sm">Remove Matchup</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Houseguest 1</label>
                    <input type="text" placeholder="Name" class="houseguest-name w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Houseguest 2</label>
                    <input type="text" placeholder="Name" class="houseguest-name w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500" required>
                </div>
            </div>
            <div class="vote-table mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Vote Table</h4>
                <table class="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th class="border border-gray-300 px-4 py-2">Host</th>
                            <th class="border border-gray-300 px-4 py-2">Houseguest 1</th>
                            <th class="border border-gray-300 px-4 py-2">Houseguest 2</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${hosts
                            .map(
                                (host) => `
                            <tr>
                                <td class="border border-gray-300 px-4 py-2">${host}</td>
                                <td class="border border-gray-300 px-4 py-2 text-center">
                                    <input type="checkbox" class="vote-checkbox" data-host="${host}" data-houseguest="1">
                                </td>
                                <td class="border border-gray-300 px-4 py-2 text-center">
                                    <input type="checkbox" class="vote-checkbox" data-host="${host}" data-houseguest="2">
                                </td>
                            </tr>`
                            )
                            .join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Add event to remove the matchup
        matchupDiv.querySelector('.remove-matchup').addEventListener('click', () => {
            matchupDiv.remove();
        });

        matchupsContainer.appendChild(matchupDiv);
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const episodeData = {
            title: form.title.value,
            episodeNumber: form.episode_number.value,
            youtubeLink: form.youtube_link.value,
            hosts,
            matchups: [],
        };

        matchupsContainer.querySelectorAll('.matchup').forEach((matchupDiv) => {
            const houseguestNames = matchupDiv.querySelectorAll('.houseguest-name');
            const votes = [];
            matchupDiv.querySelectorAll('.vote-checkbox').forEach((checkbox) => {
                if (checkbox.checked) {
                    votes.push({
                        host: checkbox.dataset.host,
                        houseguest: checkbox.dataset.houseguest,
                    });
                }
            });

            episodeData.matchups.push({
                houseguest1: houseguestNames[0].value,
                houseguest2: houseguestNames[1].value,
                votes,
            });
        });

        console.log('Episode Data:', episodeData);
        alert('Episode submitted successfully!');
        form.reset();
        hosts = [...defaultHosts];
        renderHosts();
        matchupsContainer.innerHTML = '';
    });

    // Initialize
    renderHosts();
});