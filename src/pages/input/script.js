/******************************************************
 * script.js
 * ---------------------------------
 * Heavily commented version for a beginner audience.
 *
 * Key Points:
 *   1. Only Episode Title, Houseguest Name, Houseguest
 *      Season, and Host Name are truly required.
 *   2. HOH, Veto, Nom, Placement fields are optional.
 *   3. YouTube link is optional.
 *   4. Episode number is optional.
 *   5. "Add 3 Matchups" can only be used once (and only
 *      if 0 matchups currently).
 *   6. We block Enter from submitting the form unless
 *      the focused element is a link (A) or button.
 *****************************************************/
import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:3000/graphql');
console.log('GraphQL Client initialized:', client);

document.addEventListener("DOMContentLoaded", () => {
  /******************************************************
   * DOM Elements
   *****************************************************/
  const form = document.getElementById("episodeForm");
  const addHostBtn = document.getElementById("addHostBtn");
  const hostsList = document.getElementById("hostsList");
  const addMatchupBtn = document.getElementById("addMatchupBtn");
  const matchupsContainer = document.getElementById("matchupsContainer");
  const addThreeMatchupsBtn = document.getElementById("addThreeMatchupsBtn");
  const submitEpisodeBtn = document.getElementById("submitEpisodeBtn");


  /**
   * hasUsedAddThreeMatchups:
   * Tracks whether the user already clicked "Add 3 Matchups" once.
   * We want to allow it only a single time.
   */
  let hasUsedAddThreeMatchups = false;

  /**
   * defaultHosts:
   * A starting list of hosts. The user can remove or add to these.
   * Host name is required, so each input is marked as `required`.
   */
  const defaultHosts = ["Aman", "Matt"];
  /**
   * hosts:
   * The array that changes as the user modifies the host list.
   */
  let hosts = [...defaultHosts];

  /******************************************************
   * 1) Block "Enter" from auto-submitting the form
   *    unless the focused element is a link (A) or a button
   *****************************************************/
  form.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (!["A", "BUTTON"].includes(e.target.tagName)) {
        e.preventDefault();
      }
    }
  });

  /******************************************************
   * handleVoteSelection(cell):
   * Toggles a "vote-cell" in the vote table when clicked
   * or activated with Space/Enter. Only one cell in each
   * row can be checked at a time (radio-like behavior).
   *****************************************************/
  const handleVoteSelection = (cell) => {
    const checkbox = cell.querySelector(".vote-checkbox");
    const row = cell.closest("tr");

    checkbox.checked = !checkbox.checked;

    if (checkbox.checked) {
      row.querySelectorAll(".vote-cell").forEach((otherCell) => {
        if (otherCell !== cell) {
          otherCell.classList.remove("vote-selected");
          otherCell.querySelector(".vote-checkbox").checked = false;
        }
      });
      cell.classList.add("vote-selected");
    } else {
      cell.classList.remove("vote-selected");
    }
  };

  /******************************************************
   * renderHosts():
   * Displays all current hosts in a list. Each host has
   * a remove (X) button to delete the host from the array.
   *****************************************************/
  const renderHosts = () => {
    hostsList.innerHTML = "";

    hosts.forEach((host, index) => {
      const hostDiv = document.createElement("div");

      hostDiv.innerHTML = `
        <input type="text" value="${host}" class="host-input" required>
        <button type="button" class="remove-host" aria-label="Remove host">×</button>
      `;
      hostDiv.querySelector(".remove-host").addEventListener("click", () => {
        hosts.splice(index, 1);
        renderHosts();
        updateMatchupTables();
        updateUI();
      });

      hostDiv.querySelector("input").addEventListener("input", (e) => {
        hosts[index] = e.target.value;
        updateMatchupTables();
      });

      hostsList.appendChild(hostDiv);
    });
  };

  /******************************************************
   * updateMatchupNumbers():
   * If we remove or add matchups, re-label them as
   * "Matchup 1", "Matchup 2", etc.
   *****************************************************/
  const updateMatchupNumbers = () => {
    matchupsContainer.querySelectorAll(".matchup").forEach((matchup, index) => {
      matchup.querySelector(".matchup-number").textContent = `Matchup ${
        index + 1
      }`;
    });
  };

  /******************************************************
   * updateMatchupTables():
   * When we change the hosts array, each existing matchup's
   * vote table must reflect the new set of hosts.
   *****************************************************/
  const updateMatchupTables = () => {
    matchupsContainer.querySelectorAll(".vote-table").forEach((table) => {
      const tbody = table.querySelector("tbody");

      tbody.innerHTML = hosts
        .map(
          (host) => `
          <tr>
            <td>${host}</td>
            <td 
              class="vote-cell" 
              tabindex="0"
              data-host="${host}" 
              data-houseguest="1"
            >
              <div class="checkbox-wrapper">
                <input type="checkbox" tabindex="-1" class="vote-checkbox" />
                <div class="custom-checkbox"></div>
              </div>
            </td>
            <td 
              class="vote-cell" 
              tabindex="0"
              data-host="${host}" 
              data-houseguest="2"
            >
              <div class="checkbox-wrapper">
                <input type="checkbox" tabindex="-1" class="vote-checkbox" />
                <div class="custom-checkbox"></div>
              </div>
            </td>
          </tr>
        `
        )
        .join("");

      table.querySelectorAll(".vote-cell").forEach((cell) => {
        cell.addEventListener("click", () => handleVoteSelection(cell));
        cell.addEventListener("keydown", (e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            handleVoteSelection(cell);
          }
        });
      });
    });
  };

  /******************************************************
   * updateUI():
   * Controls the availability of the "Add 3 Matchups" link
   * based on:
   *   - whether we've used it before,
   *   - whether we have 0 matchups,
   *   - whether we have at least 1 host.
   *****************************************************/
  const updateUI = () => {
    const matchupCount = matchupsContainer.children.length;
    const hasHosts = hosts.length > 0;

    if (!hasUsedAddThreeMatchups && matchupCount === 0 && hasHosts) {
      addThreeMatchupsBtn.style.opacity = "1";
      addThreeMatchupsBtn.style.pointerEvents = "auto";
    } else {
      addThreeMatchupsBtn.style.opacity = "0.5";
      addThreeMatchupsBtn.style.pointerEvents = "none";
    }
  };

  /******************************************************
   * 2) Add Host Button
   *    - Insert a new (empty) host into the array
   *    - Re-render the list
   *    - Update any existing tables
   *    - Refresh UI
   *****************************************************/
  addHostBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hosts.push("");
    renderHosts();
    updateMatchupTables();
    updateUI();
  });

  /******************************************************
   * 3) Add Single Matchup
   *    - Adds a new matchup card with 2 houseguests
   *    - The HOH, Veto, Nom, Placement fields are optional.
   *****************************************************/
  addMatchupBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const matchupDiv = document.createElement("div");
    matchupDiv.className = "matchup";

    matchupDiv.innerHTML = `
      <button type="button" class="remove-matchup" aria-label="Remove matchup">×</button>
      <div class="matchup-header">
        <h3 class="matchup-number">Matchup ${
          matchupsContainer.children.length + 1
        }</h3>
      </div>
      <div class="houseguest-info">
        <div class="houseguest-header">
          Houseguest 1 <span class="required-asterisk">*</span>
        </div>
        <div class="main-row">
          <input type="text" class="houseguest-name" placeholder="Name" required>
          <input type="text" class="season" placeholder="Season" required>
        </div>
        <div class="stats-row">
          <div>
            <label>HOH</label>
            <input type="number" min="0" value="0">
          </div>
          <div>
            <label>Veto</label>
            <input type="number" min="0" value="0">
          </div>
          <div>
            <label>Nom</label>
            <input type="number" min="0" value="0">
          </div>
          <div>
            <label>Placement</label>
            <input type="text" class="placement">
          </div>
        </div>
      </div>
      <div class="houseguest-info">
        <div class="houseguest-header">
          Houseguest 2 <span class="required-asterisk">*</span>
        </div>
        <div class="main-row">
          <input type="text" class="houseguest-name" placeholder="Name" required>
          <input type="text" class="season" placeholder="Season" required>
        </div>
        <div class="stats-row">
          <div>
            <label>HOH</label>
            <input type="number" min="0" value="0">
          </div>
          <div>
            <label>Veto</label>
            <input type="number" min="0" value="0">
          </div>
          <div>
            <label>Nom</label>
            <input type="number" min="0" value="0">
          </div>
          <div>
            <label>Placement</label>
            <input type="text" class="placement">
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
            ${hosts
              .map(
                (host) => `
                <tr>
                  <td>${host}</td>
                  <td 
                    class="vote-cell"
                    tabindex="0"
                    data-host="${host}" 
                    data-houseguest="1"
                  >
                    <div class="checkbox-wrapper">
                      <input type="checkbox" tabindex="-1" class="vote-checkbox" />
                      <div class="custom-checkbox"></div>
                    </div>
                  </td>
                  <td 
                    class="vote-cell"
                    tabindex="0"
                    data-host="${host}" 
                    data-houseguest="2"
                  >
                    <div class="checkbox-wrapper">
                      <input type="checkbox" tabindex="-1" class="vote-checkbox" />
                      <div class="custom-checkbox"></div>
                    </div>
                  </td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    matchupDiv.querySelector(".remove-matchup").addEventListener("click", () => {
      matchupDiv.remove();
      updateMatchupNumbers();
      updateUI();
    });

    matchupDiv.querySelectorAll(".vote-cell").forEach((cell) => {
      cell.addEventListener("click", () => handleVoteSelection(cell));
      cell.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleVoteSelection(cell);
        }
      });
    });

    matchupsContainer.appendChild(matchupDiv);
    updateUI();
  });

/******************************************************
 * Submit Episode Data:
 * Sends form data to the GraphQL backend.
 *****************************************************/
const submitEpisodeData = async (episodeData) => {
  const query = `
    mutation CreateEpisode($title: String!, $episodeNumber: Int, $youtubeLink: String, $hosts: [String!]!, $matchups: [MatchupInput!]!) {
      createEpisode(
        title: $title,
        episodeNumber: $episodeNumber,
        youtubeLink: $youtubeLink,
        hosts: $hosts,
        matchups: $matchups
      ) {
        id
        title
      }
    }
  `;

  try {
    const response = await client.request(query, {
      title: episodeData.title,
      episodeNumber: episodeData.episodeNumber,
      youtubeLink: episodeData.youtubeLink,
      hosts: episodeData.hosts,
      matchups: episodeData.matchups.map(matchup => ({
        houseguest1Id: matchup.houseguest1.name,
        houseguest2Id: matchup.houseguest2.name,
        votes: matchup.votes.map(vote => ({
          host: vote.host,
          houseguest: vote.houseguest
        }))
      }))
    });

    console.log('GraphQL Response:', response);
    return response;
  } catch (error) {
    console.error('Error submitting episode data:', error);
    throw error;
  }
};


  /******************************************************
   * 4) Final Submission:
   *    - Validation
   *    - Gather data into an object
   *    - Submit to GraphQL backend
   *    - Reset the form
   *****************************************************/
// Update the submit button event listener in script.js
submitEpisodeBtn.addEventListener("click", async () => {
  try {
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // Validate hosts
    if (hosts.length === 0) {
      throw new Error('At least one host is required');
    }
    
    // Validate matchups
    const matchups = matchupsContainer.querySelectorAll('.matchup');
    if (matchups.length === 0) {
      throw new Error('At least one matchup is required');
    }

    // Construct episode data
    const episodeData = {
      title: form.title.value.trim(),
      episodeNumber: form.episode_number.value ? parseInt(form.episode_number.value) : null,
      youtubeLink: form.youtube_link.value.trim() || null,
      hosts: hosts.filter(host => host.trim()),
      matchups: []
    };

    // Collect matchup data
    matchups.forEach((matchupDiv, index) => {
      const houseguestInfos = matchupDiv.querySelectorAll('.houseguest-info');
      
      // Validation helper
      const getRequiredValue = (container, selector, fieldName) => {
        const value = container.querySelector(selector)?.value?.trim();
        if (!value) {
          throw new Error(`${fieldName} is required for all houseguests`);
        }
        return value;
      };

      // Get numeric value with fallback
      const getNumericValue = (container, selector) => {
        const value = container.querySelector(selector)?.value;
        return value ? parseInt(value) : 0;
      };

      // Process both houseguests
      const houseguest1 = {
        name: getRequiredValue(houseguestInfos[0], '.houseguest-name', 'Name'),
        season: getRequiredValue(houseguestInfos[0], '.season', 'Season'),
        hohWins: getNumericValue(houseguestInfos[0], '.stats-row div:nth-child(1) input'),
        vetoWins: getNumericValue(houseguestInfos[0], '.stats-row div:nth-child(2) input'),
        nominations: getNumericValue(houseguestInfos[0], '.stats-row div:nth-child(3) input'),
        placement: houseguestInfos[0].querySelector('.placement')?.value?.trim() || null
      };

      const houseguest2 = {
        name: getRequiredValue(houseguestInfos[1], '.houseguest-name', 'Name'),
        season: getRequiredValue(houseguestInfos[1], '.season', 'Season'),
        hohWins: getNumericValue(houseguestInfos[1], '.stats-row div:nth-child(1) input'),
        vetoWins: getNumericValue(houseguestInfos[1], '.stats-row div:nth-child(2) input'),
        nominations: getNumericValue(houseguestInfos[1], '.stats-row div:nth-child(3) input'),
        placement: houseguestInfos[1].querySelector('.placement')?.value?.trim() || null
      };

      // Collect votes
      const votes = [];
      const voteTable = matchupDiv.querySelector('.vote-table');
      voteTable.querySelectorAll('.vote-checkbox').forEach((checkbox, voteIndex) => {
        if (checkbox.checked) {
          const row = checkbox.closest('tr');
          const host = row.querySelector('td').textContent.trim();
          const houseguest = parseInt(checkbox.closest('.vote-cell').dataset.houseguest);
          votes.push({ host, houseguest });
        }
      });

      // Validate that all hosts have voted
      const votingHosts = new Set(votes.map(v => v.host));
      const missingVotes = hosts.filter(host => !votingHosts.has(host));
      if (missingVotes.length > 0) {
        throw new Error(`Missing votes from: ${missingVotes.join(', ')} in matchup ${index + 1}`);
      }

      episodeData.matchups.push({
        houseguest1,
        houseguest2,
        votes
      });
    });

    // Submit the data
    console.log('Submitting episode data:', episodeData);
    await submitEpisodeData(episodeData);

    // Reset form
    form.reset();
    hosts = [...defaultHosts];
    matchupsContainer.innerHTML = '';
    hasUsedAddThreeMatchups = false;
    renderHosts();
    updateUI();

    alert('Episode submitted successfully!');
  } catch (error) {
    console.error('Submission error:', error);
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = `Error: ${error.message}`;
    submitEpisodeBtn.parentElement.insertBefore(errorDiv, submitEpisodeBtn);
  }
});

  /******************************************************
   * 5) Add Three Matchups:
   *    - Only allowed once per "session"
   *    - Only if there are 0 matchups and we have at least 1 host
   *****************************************************/
  addThreeMatchupsBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // If we've used it already or if there's already matchups, do nothing
    if (hasUsedAddThreeMatchups || matchupsContainer.children.length > 0) {
      return;
    }
    // If there are no hosts, also do nothing
    if (hosts.length === 0) {
      alert("Please add at least one host before adding matchups.");
      return;
    }

    // Otherwise, add exactly 3 matchups
    matchupsContainer.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      addMatchupBtn.click();
    }
    // Mark that we've now used "Add 3"
    hasUsedAddThreeMatchups = true;
    updateUI();
  });

  /******************************************************
   * Initialization:
   *   1) Render default hosts
   *   2) Update UI so "Add 3" link is correct initially
   *****************************************************/
  renderHosts();
  updateUI();
});