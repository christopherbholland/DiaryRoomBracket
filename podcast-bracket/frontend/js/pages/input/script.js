document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('episodeForm');
    const addHostBtn = document.getElementById('addHostBtn');
    const hostsList = document.getElementById('hostsList');
    const addMatchupBtn = document.getElementById('addMatchupBtn');
    const matchupsContainer = document.getElementById('matchupsContainer');

    const defaultHosts = ['Aman', 'Matt'];
    let hosts = [...defaultHosts]; // Start with default hosts
    const addThreeMatchupsBtn = document.getElementById('addThreeMatchupsBtn');

    // Handle vote checkbox selection
    const handleVoteSelection = (checkbox, row) => {
        if (checkbox.checked) {
            // Uncheck the other checkbox in the same row
            row.querySelectorAll('.vote-checkbox').forEach(cb => {
                if (cb !== checkbox) cb.checked = false;
            });
        }
    };

    // Render initial hosts
    const renderHosts = () => {
        hostsList.innerHTML = '';
        hosts.forEach((host, index) => {
            const hostDiv = document.createElement('div');
            hostDiv.innerHTML = `
                <input type="text" value="${host}" class="host-input" required>
                <button type="button" class="remove-host" aria-label="Remove host">×</button>
            `;
            hostDiv.querySelector('.remove-host').addEventListener('click', () => {
                hosts.splice(index, 1);
                renderHosts();
                updateMatchupTables();
                updateAddMatchupsButtonState();
            });
            hostDiv.querySelector('input').addEventListener('input', (e) => {
                hosts[index] = e.target.value;
                updateMatchupTables();
            });
            hostsList.appendChild(hostDiv);
        });
    };

    // Update matchup numbers
    const updateMatchupNumbers = () => {
        matchupsContainer.querySelectorAll('.matchup').forEach((matchup, index) => {
            matchup.querySelector('.matchup-number').textContent = `Matchup ${index + 1}`;
        });
    };

    // Update all vote tables
    const updateMatchupTables = () => {
        matchupsContainer.querySelectorAll('.vote-table').forEach(table => {
            const tbody = table.querySelector('tbody');
            tbody.innerHTML = hosts.map(host => `
                <tr>
                    <td>${host}</td>
                    <td class="text-center">
                        <input type="checkbox" class="vote-checkbox" data-host="${host}" data-houseguest="1">
                    </td>
                    <td class="text-center">
                        <input type="checkbox" class="vote-checkbox" data-host="${host}" data-houseguest="2">
                    </td>
                </tr>
            `).join('');

            // Reattach vote checkbox event listeners
            table.querySelectorAll('.vote-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    handleVoteSelection(e.target, e.target.closest('tr'));
                });
            });
        });
    };

    // Function to check if Add 3 Matchups should be enabled
    const updateAddMatchupsButtonState = () => {
        const hasHosts = hosts.length > 0;
        addThreeMatchupsBtn.style.opacity = hasHosts ? '1' : '0.5';
        addThreeMatchupsBtn.style.pointerEvents = hasHosts ? 'auto' : 'none';
    };

    // Add a new host
    addHostBtn.addEventListener('click', (e) => {
        e.preventDefault();
        hosts.push('');
        renderHosts();
        updateMatchupTables();
        updateAddMatchupsButtonState();
    });

    // Add a new matchup
    addMatchupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const matchupDiv = document.createElement('div');
        matchupDiv.className = 'matchup';

        matchupDiv.innerHTML = `
            <button type="button" class="remove-matchup" aria-label="Remove matchup">×</button>
            <div class="matchup-header">
                <h3 class="matchup-number">Matchup ${matchupsContainer.children.length + 1}</h3>
            </div>
            <div class="houseguest-info">
                <div class="houseguest-header">Houseguest 1</div>
                <div class="main-row">
                    <input type="text" class="houseguest-name" placeholder="Name" required>
                    <input type="text" class="season" placeholder="Season" required>
                </div>
                <div class="stats-row">
                    <div>
                        <label>HOH</label>
                        <input type="number" min="0" value="0" required>
                    </div>
                    <div>
                        <label>Veto</label>
                        <input type="number" min="0" value="0" required>
                    </div>
                    <div>
                        <label>Nom</label>
                        <input type="number" min="0" value="0" required>
                    </div>
                    <div>
                        <label>Placement</label>
                        <input type="text" class="placement" required>
                    </div>
                </div>
            </div>
            <div class="houseguest-info">
                <div class="houseguest-header">Houseguest 2</div>
                <div class="main-row">
                    <input type="text" class="houseguest-name" placeholder="Name" required>
                    <input type="text" class="season" placeholder="Season" required>
                </div>
                <div class="stats-row">
                    <div>
                        <label>HOH</label>
                        <input type="number" min="0" value="0" required>
                    </div>
                    <div>
                        <label>Veto</label>
                        <input type="number" min="0" value="0" required>
                    </div>
                    <div>
                        <label>Nom</label>
                        <input type="number" min="0" value="0" required>
                    </div>
                    <div>
                        <label>Placement</label>
                        <input type="text" class="placement" required>
                    </div>
                </div>
            </div>
            <div class="vote-table">
                <h4>Vote Table</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Host</th>
                            <th>Houseguest 1</th>
                            <th>Houseguest 2</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${hosts.map(host => `
                            <tr>
                                <td>${host}</td>
                                <td class="text-center">
                                    <input type="checkbox" class="vote-checkbox" data-host="${host}" data-houseguest="1">
                                </td>
                                <td class="text-center">
                                    <input type="checkbox" class="vote-checkbox" data-host="${host}" data-houseguest="2">
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Add event to remove the matchup
        matchupDiv.querySelector('.remove-matchup').addEventListener('click', () => {
            matchupDiv.remove();
            updateMatchupNumbers();
        });

        // Add vote checkbox event listeners
        matchupDiv.querySelectorAll('.vote-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                handleVoteSelection(e.target, e.target.closest('tr'));
            });
        });

        matchupsContainer.appendChild(matchupDiv);
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate that there's at least one matchup
        if (matchupsContainer.children.length === 0) {
            alert('Please add at least one matchup');
            return;
        }

        const episodeData = {
            title: form.title.value,
            episodeNumber: parseInt(form.episode_number.value),
            youtubeLink: form.youtube_link.value,
            hosts: [...hosts],
            matchups: []
        };

        // Collect and validate matchup data
        let isValid = true;
        matchupsContainer.querySelectorAll('.matchup').forEach((matchupDiv) => {
            const houseguestInputs = matchupDiv.querySelectorAll('.houseguest-name');
            const matchupNumber = matchupDiv.querySelector('.matchup-number').textContent.split(' ')[1];
            
            // Validate houseguest names
            if (!houseguestInputs[0].value || !houseguestInputs[1].value) {
                alert(`Please enter both houseguest names for Matchup ${matchupNumber}`);
                isValid = false;
                return;
            }

            const votes = [];
            matchupDiv.querySelectorAll('.vote-checkbox').forEach((checkbox) => {
                if (checkbox.checked) {
                    votes.push({
                        host: checkbox.dataset.host,
                        houseguest: parseInt(checkbox.dataset.houseguest)
                    });
                }
            });

            // Validate that each host has voted
            const hostVotes = new Set(votes.map(v => v.host));
            if (hostVotes.size !== hosts.length) {
                alert(`Please ensure all hosts have voted in Matchup ${matchupNumber}`);
                isValid = false;
                return;
            }

            episodeData.matchups.push({
                houseguest1: houseguestInputs[0].value,
                houseguest2: houseguestInputs[1].value,
                votes
            });
        });

        if (!isValid) return;

        // Here you would typically send the data to your backend
        console.log('Episode Data:', episodeData);

        // Reset the form
        form.reset();
        hosts = [...defaultHosts];
        renderHosts();
        matchupsContainer.innerHTML = '';
        
        // Show success message
        alert('Episode submitted successfully!');
    });

    // Add three matchups at once
    addThreeMatchupsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (hosts.length === 0) {
            alert('Please add at least one host before adding matchups');
            return;
        }
        
        // Clear existing matchups
        matchupsContainer.innerHTML = '';
        
        // Add exactly three matchups
        for (let i = 0; i < 3; i++) {
            addMatchupBtn.click();
        }
    });

    // Initialize the form
    renderHosts();
    updateAddMatchupsButtonState();
});