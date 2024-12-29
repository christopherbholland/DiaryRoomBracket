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
        // If the user presses Enter on something that's not <a> or <button>, block it
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
      // Inside the cell, we have a "vote-checkbox"
      const checkbox = cell.querySelector(".vote-checkbox");
      // We want to uncheck the other cell in the same row
      const row = cell.closest("tr");
  
      // Toggle the checkbox's "checked" property
      checkbox.checked = !checkbox.checked;
  
      // If we're checking this cell, uncheck all siblings in the row
      if (checkbox.checked) {
        row.querySelectorAll(".vote-cell").forEach((otherCell) => {
          if (otherCell !== cell) {
            otherCell.classList.remove("vote-selected");
            otherCell.querySelector(".vote-checkbox").checked = false;
          }
        });
        // Add a style class so we highlight it
        cell.classList.add("vote-selected");
      } else {
        // If we're unchecking this cell, remove the highlight
        cell.classList.remove("vote-selected");
      }
    };
  
    /******************************************************
     * renderHosts():
     * Displays all current hosts in a list. Each host has
     * a remove (X) button to delete the host from the array.
     *****************************************************/
    const renderHosts = () => {
      // Clear out the container first
      hostsList.innerHTML = "";
  
      // For each host in our 'hosts' array, create a little row
      hosts.forEach((host, index) => {
        // Create a div
        const hostDiv = document.createElement("div");
  
        // Insert an <input> for the host name (required) and a remove button
        hostDiv.innerHTML = `
          <input type="text" value="${host}" class="host-input" required>
          <button type="button" class="remove-host" aria-label="Remove host">×</button>
        `;
        // If user clicks "×", remove from the array
        hostDiv.querySelector(".remove-host").addEventListener("click", () => {
          hosts.splice(index, 1); // Remove that host
          renderHosts();          // Re-render host list
          updateMatchupTables();  // Hosts changed => update tables
          updateUI();             // Maybe affect "Add 3 Matchups" link
        });
  
        // If user changes the text, update the array
        hostDiv.querySelector("input").addEventListener("input", (e) => {
          hosts[index] = e.target.value;
          updateMatchupTables();
        });
  
        // Add this row to the #hostsList container
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
        // The <h3 class="matchup-number"> is re-labeled
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
      // For each existing matchup's vote table:
      matchupsContainer.querySelectorAll(".vote-table").forEach((table) => {
        const tbody = table.querySelector("tbody");
  
        // Build a new set of rows for each host
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
  
        // Attach the click/keyboard events to the new cells
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
  
      // Only allow "Add 3 Matchups" if:
      //   - hasn't been used once already,
      //   - we have 0 matchups,
      //   - and we have at least 1 host.
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
      hosts.push("");     // Create a new blank host
      renderHosts();      // Show updated host list
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
  
      // Create a container <div> for the matchup
      const matchupDiv = document.createElement("div");
      matchupDiv.className = "matchup";
  
      // HOH, Veto, Nom, Placement are optional => no "required" attribute
      // Houseguest Name and Season remain required
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
  
      // If user clicks the "×", remove this entire matchup
      matchupDiv.querySelector(".remove-matchup").addEventListener("click", () => {
        matchupDiv.remove();
        updateMatchupNumbers(); // Re-label the remaining ones
        updateUI();
      });
  
      // Hook up vote selection for each cell (click, space, enter)
      matchupDiv.querySelectorAll(".vote-cell").forEach((cell) => {
        cell.addEventListener("click", () => handleVoteSelection(cell));
        cell.addEventListener("keydown", (e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            handleVoteSelection(cell);
          }
        });
      });
  
      // Append the newly created matchup to the matchupsContainer
      matchupsContainer.appendChild(matchupDiv);
      // Maybe re-check "Add 3" logic, etc.
      updateUI();
    });
  
    /******************************************************
     * 4) Final Submission:
     *    - Minimal validation
     *    - Gather data into an object
     *    - "Submit" by printing to console
     *    - Reset the form
     *****************************************************/
    submitEpisodeBtn.addEventListener("click", () => {
      /******************************************************
       * Validation:
       *   - If ANY `input[required]` is empty => single alert
       *   - Must have at least 1 matchup
       *****************************************************/
      const requiredFields = form.querySelectorAll("input[required]");
      for (let i = 0; i < requiredFields.length; i++) {
        if (!requiredFields[i].value.trim()) {
          alert("Some required fields are missing. Please fix them and try again.");
          return;
        }
      }
      if (matchupsContainer.children.length === 0) {
        alert("Please add at least one matchup before submitting.");
        return;
      }
  
      // Build our final data object
      const episodeData = {
        // Episode Title is required
        title: form.title.value,
        // Episode number is optional (could be blank)
        episodeNumber: form.episode_number.value
          ? parseInt(form.episode_number.value)
          : undefined,
        // YouTube link is optional
        youtubeLink: form.youtube_link.value || "",
        hosts: [...hosts],
        matchups: [],
      };
  
      // Collect data from each matchup
      matchupsContainer.querySelectorAll(".matchup").forEach((matchupDiv) => {
        // The two required fields for each houseguest: Name, Season
        const houseguestInputs = matchupDiv.querySelectorAll(".houseguest-name");
        const votes = [];
  
        // If a vote checkbox is checked, we note which host voted for which houseguest
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
  
        // Houseguest 1 data
        const hohWins1 = parseInt(
          matchupDiv.querySelector(
            ".houseguest-info:nth-child(2) input[type='number']:nth-of-type(1)"
          ).value
        ) || 0;
        const vetoWins1 = parseInt(
          matchupDiv.querySelector(
            ".houseguest-info:nth-child(2) input[type='number']:nth-of-type(2)"
          ).value
        ) || 0;
        const nominations1 = parseInt(
          matchupDiv.querySelector(
            ".houseguest-info:nth-child(2) input[type='number']:nth-of-type(3)"
          ).value
        ) || 0;
        const placement1 = matchupDiv.querySelector(
          ".houseguest-info:nth-child(2) .placement"
        ).value;
  
        // Houseguest 2 data
        const hohWins2 = parseInt(
          matchupDiv.querySelector(
            ".houseguest-info:nth-child(3) input[type='number']:nth-of-type(1)"
          ).value
        ) || 0;
        const vetoWins2 = parseInt(
          matchupDiv.querySelector(
            ".houseguest-info:nth-child(3) input[type='number']:nth-of-type(2)"
          ).value
        ) || 0;
        const nominations2 = parseInt(
          matchupDiv.querySelector(
            ".houseguest-info:nth-child(3) input[type='number']:nth-of-type(3)"
          ).value
        ) || 0;
        const placement2 = matchupDiv.querySelector(
          ".houseguest-info:nth-child(3) .placement"
        ).value;
  
        // Add an object with the 2 houseguests + the votes array
        episodeData.matchups.push({
          houseguest1: {
            name: houseguestInputs[0].value,
            season: matchupDiv.querySelector(
              ".houseguest-info:nth-child(2) .season"
            ).value,
            hohWins: hohWins1,
            vetoWins: vetoWins1,
            nominations: nominations1,
            placement: placement1,
          },
          houseguest2: {
            name: houseguestInputs[1].value,
            season: matchupDiv.querySelector(
              ".houseguest-info:nth-child(3) .season"
            ).value,
            hohWins: hohWins2,
            vetoWins: vetoWins2,
            nominations: nominations2,
            placement: placement2,
          },
          votes,
        });
      });
  
      // Show the data (pretend we're sending to a server)
      console.log("Episode Data:", episodeData);
  
      // Reset everything to start fresh
      form.reset(); // Clears out all text fields
      hosts = [...defaultHosts]; // Return to default hosts
      matchupsContainer.innerHTML = ""; // No matchups
      hasUsedAddThreeMatchups = false; // Let them do "Add 3 Matchups" again if they want
      renderHosts();
      updateUI();
  
      // Show a success alert
      alert("Episode submitted successfully!");
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