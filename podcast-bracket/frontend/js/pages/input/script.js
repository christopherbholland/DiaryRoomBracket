document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("episodeForm");
    const addHostBtn = document.getElementById("addHostBtn");
    const hostsList = document.getElementById("hostsList");
    const addMatchupBtn = document.getElementById("addMatchupBtn");
    const matchupsContainer = document.getElementById("matchupsContainer");
    const addThreeMatchupsBtn = document.getElementById("addThreeMatchupsBtn");
    const submitEpisodeBtn = document.getElementById("submitEpisodeBtn");
  
    // If we've used "Add 3 Matchups" once, we won't allow it again
    let hasUsedAddThreeMatchups = false;
  
    // Prevent pressing Enter anywhere from auto-submitting the form,
    // except if the current focus is on a link (A) or button.
    form.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        // Allow "Enter" for actual links or buttons
        if (!["A", "BUTTON"].includes(e.target.tagName)) {
          e.preventDefault();
        }
      }
    });
  
    const defaultHosts = ["Aman", "Matt"];
    let hosts = [...defaultHosts]; // Start with default hosts
  
    // Handle vote selection
    const handleVoteSelection = (cell) => {
      const checkbox = cell.querySelector(".vote-checkbox");
      const row = cell.closest("tr");
  
      // Toggle the state
      checkbox.checked = !checkbox.checked;
  
      // Update cell class and uncheck others in the same row
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
  
    // Render initial hosts
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
  
    // Update matchup numbers
    const updateMatchupNumbers = () => {
      matchupsContainer.querySelectorAll(".matchup").forEach((matchup, index) => {
        matchup.querySelector(".matchup-number").textContent = `Matchup ${
          index + 1
        }`;
      });
    };
  
    // Update all vote tables
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
  
        // Add click + keyboard handlers
        table.querySelectorAll(".vote-cell").forEach((cell) => {
          cell.addEventListener("click", () => handleVoteSelection(cell));
  
          // Space or Enter toggles
          cell.addEventListener("keydown", (e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              handleVoteSelection(cell);
            }
          });
        });
      });
    };
  
    // ----- UI Update Logic -----
    const updateUI = () => {
      // Only allow "Add 3 Matchups" if:
      //  - We haven't used it before, AND
      //  - There are 0 matchups, AND
      //  - We have at least one host
      const hasHosts = hosts.length > 0;
      const matchupCount = matchupsContainer.children.length;
  
      if (!hasUsedAddThreeMatchups && matchupCount === 0 && hasHosts) {
        addThreeMatchupsBtn.style.opacity = "1";
        addThreeMatchupsBtn.style.pointerEvents = "auto";
      } else {
        addThreeMatchupsBtn.style.opacity = "0.5";
        addThreeMatchupsBtn.style.pointerEvents = "none";
      }
    };
  
    // Add a new host
    addHostBtn.addEventListener("click", (e) => {
      e.preventDefault();
      hosts.push("");
      renderHosts();
      updateMatchupTables();
      updateUI();
    });
  
    // Add a new matchup
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
  
      // Remove this matchup if user clicks X
      matchupDiv.querySelector(".remove-matchup").addEventListener("click", () => {
        matchupDiv.remove();
        updateMatchupNumbers();
        updateUI();
      });
  
      // Hook up click + keyboard for newly created cells
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
  
    // Manually triggered submission
    submitEpisodeBtn.addEventListener("click", () => {
      // ===== Simplified Validation =====
      // If ANY required field is empty, show a single error alert and stop.
      const requiredFields = form.querySelectorAll("input[required]");
      for (let i = 0; i < requiredFields.length; i++) {
        if (!requiredFields[i].value.trim()) {
          alert("Some required fields are missing. Please fix them and try again.");
          return;
        }
      }
  
      // If we have no matchups at all, fail
      if (matchupsContainer.children.length === 0) {
        alert("Please add at least one matchup before submitting.");
        return;
      }
  
      // Gather data
      const episodeData = {
        title: form.title.value,
        episodeNumber: parseInt(form.episode_number.value),
        youtubeLink: form.youtube_link.value,
        hosts: [...hosts],
        matchups: [],
      };
  
      matchupsContainer.querySelectorAll(".matchup").forEach((matchupDiv) => {
        const houseguestInputs = matchupDiv.querySelectorAll(".houseguest-name");
        // Just basic data-collection
        const votes = [];
        matchupDiv.querySelectorAll(".vote-checkbox").forEach((checkbox) => {
          if (checkbox.checked) {
            votes.push({
              host: checkbox.closest("tr").querySelector("td").textContent,
              houseguest: parseInt(
                checkbox.closest(".vote-cell").dataset.houseguest
              ),
            });
          }
        });
  
        episodeData.matchups.push({
          houseguest1: {
            name: houseguestInputs[0].value,
            season: matchupDiv.querySelector(
              ".houseguest-info:nth-child(2) .season"
            ).value,
            hohWins: parseInt(
              matchupDiv.querySelector(
                ".houseguest-info:nth-child(2) input[type='number']:nth-of-type(1)"
              ).value
            ),
            vetoWins: parseInt(
              matchupDiv.querySelector(
                ".houseguest-info:nth-child(2) input[type='number']:nth-of-type(2)"
              ).value
            ),
            nominations: parseInt(
              matchupDiv.querySelector(
                ".houseguest-info:nth-child(2) input[type='number']:nth-of-type(3)"
              ).value
            ),
            placement: matchupDiv.querySelector(
              ".houseguest-info:nth-child(2) .placement"
            ).value,
          },
          houseguest2: {
            name: houseguestInputs[1].value,
            season: matchupDiv.querySelector(
              ".houseguest-info:nth-child(3) .season"
            ).value,
            hohWins: parseInt(
              matchupDiv.querySelector(
                ".houseguest-info:nth-child(3) input[type='number']:nth-of-type(1)"
              ).value
            ),
            vetoWins: parseInt(
              matchupDiv.querySelector(
                ".houseguest-info:nth-child(3) input[type='number']:nth-of-type(2)"
              ).value
            ),
            nominations: parseInt(
              matchupDiv.querySelector(
                ".houseguest-info:nth-child(3) input[type='number']:nth-of-type(3)"
              ).value
            ),
            placement: matchupDiv.querySelector(
              ".houseguest-info:nth-child(3) .placement"
            ).value,
          },
          votes,
        });
      });
  
      // Here you would typically send the data to your backend
      console.log("Episode Data:", episodeData);
  
      // Reset the form
      form.reset();
      hosts = [...defaultHosts];
      matchupsContainer.innerHTML = "";
      hasUsedAddThreeMatchups = false; // Let them add 3 again if they want a new episode
      renderHosts();
      updateUI();
  
      alert("Episode submitted successfully!");
    });
  
    // Add three matchups at once
    addThreeMatchupsBtn.addEventListener("click", (e) => {
      e.preventDefault();
  
      // If we've already used this or if there's ANY matchups, do nothing
      if (hasUsedAddThreeMatchups || matchupsContainer.children.length > 0) return;
  
      if (hosts.length === 0) {
        alert("Please add at least one host before adding matchups.");
        return;
      }
  
      // Clear existing matchups (should be 0 anyway)
      matchupsContainer.innerHTML = "";
  
      // Add exactly three matchups
      for (let i = 0; i < 3; i++) {
        addMatchupBtn.click();
      }
  
      // Mark that we've used this link
      hasUsedAddThreeMatchups = true;
      updateUI();
    });
  
    // Initialize
    renderHosts();
    updateUI();
  });