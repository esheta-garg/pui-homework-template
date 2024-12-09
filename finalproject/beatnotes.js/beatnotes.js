// Get the elements from the HTML using their IDs
const grid = document.getElementById('grid'); // The grid element where the beatmaker cells will be displayed
const labels = document.getElementById('labels'); // The element to display instrument labels
const playButton = document.getElementById('play-button'); // The play/stop button to control playback
const bpmInput = document.getElementById('bpm'); // The input field to set the BPM (beats per minute)

// Set up the number of rows and columns for the grid
const rows = 8; // Number of rows, corresponding to the number of instruments
const cols = 16; // Number of columns, corresponding to the number of beats in the loop

// List of instrument names and their associated colors
const instruments = ['Kick', 'Snare', 'Hi-hat', 'Tom', 'Clap', 'Open Hat', 'Ride', 'Snap']; // Names of instruments
const colors = ['#D63230', '#48C210', '#4149D9', '#C21B5E', '#EE7809', '#01BB83', '#7C1BC2', '#8F9606']; // Colors to represent each instrument visually

// Create a 2D array to track the state of each beat (on/off)
let beatPattern = []; // Array to store the beat pattern
for (let i = 0; i < rows; i++) { // Loop through each row (instrument)
    beatPattern[i] = []; // Create an array for each row
    for (let j = 0; j < cols; j++) { // Loop through each column (beat)
        beatPattern[i][j] = false; // Initialize each beat to "off" (false)
    }
}

// Variables to control playback state and timing
let isPlaying = false; // Tracks whether playback is active
let currentCol = 0; // Tracks the current column being played
let lastTime = 0; // Tracks the last timestamp for beat timing

// Map instrument names to sound file paths
const soundFiles = {
    'Kick': 'Sounds/beatmakerkick.mp3',
    'Snare': 'Sounds/beatmakersnare.mp3',
    'Hi-hat': 'Sounds/beatmakerhihat.mp3',
    'Tom': 'Sounds/beatmakertom.mp3',
    'Clap': 'Sounds/beatmakerclap.mp3',
    'Open Hat': 'Sounds/beatmakeropenhat.mp3',
    'Ride': 'Sounds/beatmakerride.mp3',
    'Snap': 'Sounds/beatmakersnap.mp3'
};

// Load sound files using Howler.js for playback
const sounds = {}; // Object to store Howler.js sound instances
for (let instrument in soundFiles) { // Loop through each instrument in the soundFiles object
    sounds[instrument] = new Howl({ // Create a Howler.js instance for each sound
        src: [soundFiles[instrument]], // Set the source file for the sound
        onload: function() { // Callback for successful loading
            console.log(instrument + " loaded successfully");
        },
        onloaderror: function(id, error) { // Callback for load errors
            console.error("Error loading " + instrument + ":", error);
        }
    });
}

// Function to create the beatmaker interface
function createBeatmaker() {
    // Create and add labels for each instrument
    for (let i = 0; i < instruments.length; i++) {
        let label = document.createElement('div'); // Create a div for the label
        label.className = 'label'; // Assign the 'label' class for styling
        label.style.backgroundColor = colors[i]; // Set the background color to the instrument's color
        label.textContent = instruments[i]; // Set the text content to the instrument name
        labels.appendChild(label); // Append the label to the labels container
    }

    // Create grid cells for the beatmaker
    for (let i = 0; i < rows; i++) { // Loop through each row
        for (let j = 0; j < cols; j++) { // Loop through each column
            let cell = document.createElement('div'); // Create a div for the cell
            cell.className = 'cell'; // Assign the 'cell' class for styling
            cell.dataset.row = i; // Store the row index as a data attribute
            cell.dataset.col = j; // Store the column index as a data attribute
            cell.addEventListener('click', toggleCell); // Add click event to toggle the cell state
            cell.addEventListener('mouseenter', function() { highlightRow(i, true); }); // Add mouseenter event to highlight row
            cell.addEventListener('mouseleave', function() { highlightRow(i, false); }); // Add mouseleave event to unhighlight row
            grid.appendChild(cell); // Append the cell to the grid container
        }
    }
}

// Function to toggle a cell's state when clicked
function toggleCell() {
    const row = parseInt(this.dataset.row); // Get the row index from the data attribute
    const col = parseInt(this.dataset.col); // Get the column index from the data attribute
    beatPattern[row][col] = !beatPattern[row][col]; // Toggle the beat's state (true/false)
    this.style.backgroundColor = beatPattern[row][col] ? colors[row] : '#333'; // Change the cell's color based on its state
}

// Function to highlight or unhighlight a row
function highlightRow(row, highlight) {
    const cells = document.querySelectorAll(`.cell[data-row="${row}"]`); // Select all cells in the row
    cells.forEach(function(cell) {
        if (highlight) {
            cell.classList.add('row-highlight'); // Add highlight class
        } else {
            cell.classList.remove('row-highlight'); // Remove highlight class
        }
    });
}

// Function to play the beat in a loop
function playBeat(timestamp) {
    if (!isPlaying) return; // Stop if playback is not active

    const bpm = parseInt(bpmInput.value); // Get the BPM from the input
    const interval = (60000 / (bpm * 4)); // Calculate the interval between beats in milliseconds

    if (!lastTime) lastTime = timestamp; // Initialize lastTime if it's the first frame

    if (timestamp - lastTime >= interval) { // Check if the interval has elapsed
        clearColumn(currentCol); // Clear highlight from the current column
        currentCol++; // Move to the next column
        if (currentCol >= cols) currentCol = 0; // Loop back to the first column if at the end

        highlightColumn(currentCol); // Highlight the current column

        for (let i = 0; i < rows; i++) { // Loop through each row
            if (beatPattern[i][currentCol]) { // Check if the beat is active
                playSound(i); // Play the sound for the instrument
            }
        }

        lastTime = timestamp; // Update the lastTime to the current timestamp
    }

    requestAnimationFrame(playBeat); // Request the next animation frame to continue playback
}

// Function to clear highlight from a column
function clearColumn(col) {
    const cells = document.querySelectorAll(`.cell[data-col="${col}"]`); // Select all cells in the column
    cells.forEach(function(cell) {
        cell.style.boxShadow = 'none'; // Remove the highlight effect
    });
}

// Function to highlight the current column
function highlightColumn(col) {
    const cells = document.querySelectorAll(`.cell[data-col="${col}"]`); // Select all cells in the column
    cells.forEach(function(cell) {
        cell.style.boxShadow = '0 0 0 2px white inset'; // Add a highlight effect
    });
}

// Function to play a sound for a specific instrument
function playSound(instrumentIndex) {
    const instrumentName = instruments[instrumentIndex]; // Get the instrument name by index
    if (sounds[instrumentName]) { // Check if the sound exists
        sounds[instrumentName].play(); // Play the sound using Howler.js
    }
}

// Event listener for the play/stop button
playButton.addEventListener('click', function() {
    isPlaying = !isPlaying; // Toggle playback state
    playButton.textContent = isPlaying ? 'Stop' : 'Play'; // Update the button text

    if (isPlaying) {
        currentCol = -1; // Reset to start column
        lastTime = 0; // Reset timing
        requestAnimationFrame(playBeat); // Start playing the beats
    }
});

// Initialize the beatmaker interface by creating the grid and labels
createBeatmaker();

// Function to clear all cells and reset the beat pattern
function clearAll() {
    beatPattern.forEach(function(row) {
        row.fill(false); // Reset each row in the beat pattern to false
    });

    const cells = document.querySelectorAll('.cell'); // Select all cells
    cells.forEach(function(cell) {
        cell.style.backgroundColor = '#333'; // Reset the cell colors
    });
}

// Event listener for the clear all button
document.getElementById('clear-all').addEventListener('click', clearAll); // Add click event to clear all button
