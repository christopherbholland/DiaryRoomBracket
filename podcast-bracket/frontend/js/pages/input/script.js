/******************************************************
 * script.js
 * ---------------------------------
 * This script handles all the interactivity and logic
 * for our "Add Episode" form. It covers:
 *   1. Preventing accidental form submissions via Enter
 *   2. Rendering Hosts
 *   3. Adding and removing matchups
 *   4. Handling vote selection
 *   5. Limiting "Add 3 Matchups" to a single use
 *   6. Simple validation and final data submission
 *****************************************************/

document.addEventListener("DOMContentLoaded", () => {
    // Get references to key DOM elements.
    const form = document.getElementById("episodeForm");
    const addHostBtn = document.getElementById("addHostBtn");
    const hostsList = document.getElementById("hostsList");
    const addMatchupBtn = document.getElementById("addMatchupBtn");
    const matchupsContainer = document.getElementById("matchupsContainer");
    const addThreeMatchupsBtn = document.getElementById("addThreeMatchupsBtn");
    const submitEpisodeBtn = document.getElementById("submitEpisodeBtn");
  
    /**
     * This variable tracks whether the user has used "Add 3 Matchups" yet.
     * Once they've used it, we won't let them use it again (unless they reset
     * the entire form by submitting and starting over).
     */
    let hasUsedAddThreeMatchups = false;
  
    /**
     * Our default hosts. We'll start with these in the form.
     * The user can delete or add more hosts.
     */
    const defaultHosts = ["Aman", "Matt"];
  
    /**
     * A mutable array of hosts that changes as the user
     * adds or removes them.
     */
    let hosts = [...defaultHosts]; // Spread syntax copies the default array
  
    /**
     * Prevent pressing Enter in text fields from automatically submitting the form.
     * EXCEPT if the currently focused element is a link (A) or button—then we allow
     * Enter to "click" that element.
     */
    form.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        // e.target is the element that currently has focus
        if (!["A", "BUTTON"].includes(e.target.tagName)) {
          e.preventDefault(); // Stop form submission
        }
      }
    });
  
    /******************************************************
     * handleVoteSelection
     * ---------------------------------
     * This function toggles a vote-cell when the user
     * clicks or presses Enter/Space on it.
     *****************************************************/
    const handleVoteSelection = (cell) => {
      // Each cell contains an <input type="checkbox" /> called ".vote-checkbox"
      const checkbox = cell.querySelector(".vote-checkbox");
      // The row is <tr>. We find it so we can uncheck the other cell in the same row
      const row = cell.closest("tr");
  
      // Toggle the checked state. If it was false => true, etc.
      checkbox.checked = !checkbox.checked;
  
      if (checkbox.checked) {
        // If we're checking this box, we should uncheck any other votes in the same row
        row.querySelectorAll(".vote-cell").forEach((otherCell) => {
          if (otherCell !== cell) {
            // Remove the "vote-selected" class from the other cell
            otherCell.classList.remove("vote-selected");
            // Also ensure its checkbox is false
            otherCell.querySelector(".vote-checkbox").checked = false;
          }
        });
        // Give our clicked cell the "vote-selected" style
        cell.classList.add("vote-selected");
      } else {
        // If we're unchecking it, remove the "vote-selected" style
        cell.classList.remove("vote-selected");
      }
    };
  
    /******************************************************
     * renderHosts
     * ---------------------------------
     * This function displays all the current hosts
     * in the "Hosts" section, along with a button
     * to remove each host if desired.
     *****************************************************/
    const renderHosts = () => {
      // Clear out the current list
      hostsList.innerHTML = "";
  
      // For each host in the 'hosts' array, create a small row
      hosts.forEach((host, index) => {
        // Create a container div
        const hostDiv = document.createElement("div");
  
        // We put an <input> for the host name and a remove (X) button
        hostDiv.innerHTML = `
          <input type="text" value="${host}" class="host-input" required>
          <button type="button" class="remove-host" aria-label="Remove host">×</button>
        `;
  
        // When the user clicks X, remove that host from the array
        hostDiv.querySelector(".remove-host").addEventListener("click", () => {
          hosts.splice(index, 1);    // Remove 1 item at position index
          renderHosts();             // Re-render
          updateMatchupTables();     // Reflect changes in existing matchups
          updateUI();                // Update the UI for "Add 3" link, etc.
        });
  
        // When the host name changes, update the array and re-render the tables
        hostDiv.querySelector("input").addEventListener("input", (e) => {
          hosts[index] = e.target.value;
          updateMatchupTables();
        });
  
        // Add this row to the #hostsList container
        hostsList.appendChild(hostDiv);
      });
    };
  
    /******************************************************
     * updateMatchupNumbers
     * ---------------------------------
     * Renumber the matchups (e.g., "Matchup 1", "Matchup 2", etc.)
     * whenever we add or remove a matchup.
     *****************************************************/
    const updateMatchupNumbers = () => {
      matchupsContainer.querySelectorAll(".matchup").forEach((matchup, index) => {
        // We assume there's an element with the class ".matchup-number" for the label
        matchup.querySelector(".matchup-number").textContent = `Matchup ${
          index + 1
        }`;
      });
    };
  
    /******************************************************
     * updateMatchupTables
     * ---------------------------------
     * Whenever the list of hosts changes, we need to update
     * each existing matchup's vote table so it has the new
     * host names in each row.
     *****************************************************/
    const updateMatchupTables = () => {
      // For each matchup's table (if any):
      matchupsContainer.querySelectorAll(".vote-table").forEach((table) => {
        // We'll rebuild the <tbody> each time
        const tbody = table.querySelector("tbody");
  
        // Build up the new <tr> rows with the updated hosts
        tbody.innerHTML = hosts
          .map((host) => {
            return `
              <tr>
                <td>${host}</td>
                <td 
                  class="vote-cell" 
                  tabindex="0"
                  data-host="${host}" 
                  data-houseguest="1"
                >
                  <div class="checkbox-wrapper">
                    <!-- The checkbox is hidden from direct tabbing, so we use the cell focus -->
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
            `;
          })
          .join("");
  
        // Once the rows are re-generated, we attach our vote event handlers again
        table.querySelectorAll(".vote-cell").forEach((cell) => {
          // Click anywhere in the cell toggles the vote
          cell.addEventListener("click", () => handleVoteSelection(cell));
  
          // Pressing Space or Enter also toggles the vote
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
     * updateUI
     * ---------------------------------
     * This function updates elements like:
     *  - The "Add 3 Matchups" link (should it be disabled?)
     *  - Any other conditions that change depending on the
     *    number of hosts, matchups, etc.
     *****************************************************/
    const updateUI = () => {
      // We only allow "Add 3 Matchups" if:
      //  - We have not used it before (hasUsedAddThreeMatchups === false)
      //  - We have 0 existing matchups
      //  - We have at least 1 host
      const hasHosts = hosts.length > 0;
      const matchupCount = matchupsContainer.children.length;
  
      if (!hasUsedAddThreeMatchups && matchupCount === 0 && hasHosts) {
        // Make the "Add 3" link clickable
        addThreeMatchupsBtn.style.opacity = "1";
        addThreeMatchupsBtn.style.pointerEvents = "auto";
      } else {
        // Otherwise, disable it (i.e., fade it out and remove pointer events)
        addThreeMatchupsBtn.style.opacity = "0.5";
        addThreeMatchupsBtn.style.pointerEvents = "none";
      }
    };
  
    /******************************************************
     * addHostBtn
     * ---------------------------------
     * When the user clicks "+ Add Host":
     *  - We add an empty entry to the 'hosts' array
     *  - Then re-render the list of hosts
     *  - Update the vote tables so they include the new host
     *  - Finally, update the UI in case that affects "Add 3" etc.
     *****************************************************/
    addHostBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Stop the default link action
      hosts.push("");     // Insert an empty string for a new host
      renderHosts();      // Re-render all hosts
      updateMatchupTables(); // Make sure tables show the new host
      updateUI();         // Update UI
    });
  
    /******************************************************
     * addMatchupBtn
     * ---------------------------------
     * When the user clicks "+ Add Single Matchup":
     *  - We create a single new matchup card with 2 houseguests.
     *  - We also create a vote table that includes all current hosts.
     *****************************************************/
    addMatchupBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Stop the default link action
  
      // Create a new DIV for the matchup
      const matchupDiv = document.createElement("div");
      matchupDiv.className = "matchup";
  
      // We'll fill this <div> with HTML for:
      //  1. The remove (X) button
      //  2. Houseguest 1
      //  3. Houseguest 2
      //  4. The vote table
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
  
      // Add a click handler to remove this entire matchup
      matchupDiv.querySelector(".remove-matchup").addEventListener("click", () => {
        // Remove it from the DOM
        matchupDiv.remove();
        // Renumber any remaining matchups
        updateMatchupNumbers();
        // Update UI if needed (like re-checking "Add 3" logic, etc.)
        updateUI();
      });
  
      // For each new vote-cell, add the same click + keyboard toggles as above
      matchupDiv.querySelectorAll(".vote-cell").forEach((cell) => {
        // Clicking toggles
        cell.addEventListener("click", () => handleVoteSelection(cell));
        // Pressing space or enter toggles
        cell.addEventListener("keydown", (e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            handleVoteSelection(cell);
          }
        });
      });
  
      // Put this new matchup into the container
      matchupsContainer.appendChild(matchupDiv);
      // Then update the UI (in case we want to disable "Add 3" or something)
      updateUI();
    });
  
    /******************************************************
     * submitEpisodeBtn
     * ---------------------------------
     * This is our manual "Submit Episode" button handler.
     * We do a minimal check to ensure required fields are
     * filled, and if all is good, we gather data into an
     * object and log it.
     *****************************************************/
    submitEpisodeBtn.addEventListener("click", () => {
      // First: Check that required fields are not empty
      const requiredFields = form.querySelectorAll("input[required]");
      for (let i = 0; i < requiredFields.length; i++) {
        // If a required field is blank (or all whitespace),
        // show a simple alert and stop.
        if (!requiredFields[i].value.trim()) {
          alert("Some required fields are missing. Please fix them and try again.");
          return;
        }
      }
  
      // Next, ensure there's at least one matchup
      if (matchupsContainer.children.length === 0) {
        alert("Please add at least one matchup before submitting.");
        return;
      }
  
      // Build a data object with everything we need
      const episodeData = {
        title: form.title.value,
        episodeNumber: parseInt(form.episode_number.value),
        youtubeLink: form.youtube_link.value,
        hosts: [...hosts], // shallow copy
        matchups: [],
      };
  
      // For each matchup, we'll gather info on:
      //  houseguest1, houseguest2, votes
      matchupsContainer.querySelectorAll(".matchup").forEach((matchupDiv) => {
        // This gets all the "Name" inputs for houseguest1, houseguest2
        const houseguestInputs = matchupDiv.querySelectorAll(".houseguest-name");
  
        // We'll gather the votes
        const votes = [];
        // For each checkbox in this matchup, if it's checked, push info
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
  
        // Add this matchup's data to our main object
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
  
      // At this point, we might send this data to a server
      // For the demo, we'll just log it
      console.log("Episode Data:", episodeData);
  
      // Now we reset the form completely
      form.reset(); // Clears out all text fields
      hosts = [...defaultHosts]; // Reset hosts to default
      matchupsContainer.innerHTML = ""; // Remove all matchups
      hasUsedAddThreeMatchups = false;   // Let them use "Add 3" again if they'd like
      renderHosts();         // Re-render the default hosts
      updateUI();            // Make sure "Add 3" is back if appropriate
  
      alert("Episode submitted successfully!");
    });
  
    /******************************************************
     * addThreeMatchupsBtn
     * ---------------------------------
     * When the user clicks "Add 3 Matchups":
     *   1. It checks if we haven't used it before.
     *   2. Clears out any existing matchups (should be 0 anyway).
     *   3. Creates exactly 3 matchups in a row.
     *   4. Marks "hasUsedAddThreeMatchups = true" so we can't do it again.
     *****************************************************/
    addThreeMatchupsBtn.addEventListener("click", (e) => {
      e.preventDefault();
  
      // If we've already used this or there's already matchups, do nothing
      if (hasUsedAddThreeMatchups || matchupsContainer.children.length > 0) {
        return;
      }
  
      // If there are no hosts, we can't add matchups
      if (hosts.length === 0) {
        alert("Please add at least one host before adding matchups.");
        return;
      }
  
      // Clear out existing matchups
      matchupsContainer.innerHTML = "";
  
      // Programmatically click "+ Add Single Matchup" 3 times
      for (let i = 0; i < 3; i++) {
        addMatchupBtn.click();
      }
  
      // Now we've used it
      hasUsedAddThreeMatchups = true;
      // Update UI to disable the "Add 3" button
      updateUI();
    });
  
    /******************************************************
     * Initialization
     * ---------------------------------
     * Run these steps as soon as the page loads:
     *   1. Display the default hosts
     *   2. Update the UI so the "Add 3" link is set up
     *****************************************************/
    renderHosts();
    updateUI();
  });