// selecting the HTML elements for the grid, labels, play button, and BPM input
let grid = document.getElementById('grid');
let labels = document.getElementById('labels');
let playButton = document.getElementById('play-button');
let bpmInput = document.getElementById('bpm');

// defining  the number of rows (which are the instruments) and columns (beats per bar) in the beat grid
let rows = 8;
let cols = 16;

// defining the instruments and the corresponding colors to those instruments 
let instruments = ['Kick', 'Snare', 'Hihat', 'Tom', 'Clap', 'Open Hat', 'Ride', 'Snap'];
let colors = ['#D63230', '#48C210', '#4149D9', '#C21B5E', '#804700', '#01484F', '#7C1BC2', '#315A02'];


// xreating a 2D array to store the beat pattern (true = active, false = inactive), where each row corresponds to an instrument, and each column corresponds to a beat
let beatPattern = Array(rows).fill().map(() => Array(cols).fill(false));


let sounds = {}; //create an object to store the sounds for instrumnents.
for (let i = 0; i < instruments.length; i++) {// a for loop iterating thru the instrument array 
sounds[instruments[i]] = new Howl({
    src: ['Sounds/beatmaker' + instruments[i].toLowerCase().replace(' ', '') + '.mp3']// // loading audio files dynamically based on instrument names
    });
}

function createBeatmaker() {
    // creating and display instrument labels for each instrument dynamically 
    for (let i = 0; i < instruments.length; i++) {
        let label = document.createElement('div'); //creating a label element
        label.className = 'label'; //  assigning css for styling
        label.style.backgroundColor = colors[i];// settting background color for label based on corresponding color
        label.textContent = instruments[i];//setting label text to instrument name
        labels.appendChild(label);// add the label to the labels container 
    }
// creating a grid for the cells for the beatmaker
    for (let i = 0; i < rows; i++) { // looping through each row (instrument)
        for (let j = 0; j < cols; j++) {// looping thru each column (beat)
            let cell = document.createElement('div'); // create a cell element
            cell.className = 'cell';
            cell.dataset.row = i;// storing the row index e
            cell.dataset.col = j;// storing the column index 
            cell.onclick = function() { toggleCell(this); }; // add click event handler for toggling cell on and off
            grid.appendChild(cell); // adding the cell to the grid container
        }
    }
}

function toggleCell(cell) {
let row = Number(cell.dataset.row); // getting the row index from the cell's data attribute
let col = Number(cell.dataset.col); //getting the col index

//// updating the cell's color based on its state
if (beatPattern[row][col] === true) {
    beatPattern[row][col] = false;
} else {
    beatPattern[row][col] = true;
}
    if (beatPattern[row][col] === true) {
        cell.style.backgroundColor = colors[row];// if the cell is active (true) sets the background color to colors[row]
    } else {
        cell.style.backgroundColor = '#333';//if cell is not active, background set to dark gray
    }
}

function columnBright(col) {// function that adds a highlight to the column, indiacating playhead effect
    let boxes = document.querySelectorAll(`[data-col="${col}"]`); //selecting all cells in the column
    for (let box of boxes) {
        box.style.border = '2px solid white'; // iterates thru cells, adds the highlight
    }
}

function columnDark(col) {// function that removes the highlight from a column
    let boxes = document.querySelectorAll(`[data-col="${col}"]`);
    for (let box of boxes) {
        box.style.border = 'none';// iterates thru cells, removes the highlight
    }
}

// variables for playback
let currentCol = 0; // tracking the current column it is on for the playhead
let lastTime = 0; //timestamp for the last beat// Timestamp for the last beat

let isPlaying = false; // if the beatmaker is currently playing or not

function playBeat(timestamp) {
    if (!isPlaying) return;// stop if the playback is not active 

    // calculate the time between beats based on BPM
    let interval = 60000 / (bpmInput.value * 4);

    // // initialize lastTime 
    if (!lastTime) lastTime = timestamp;

      // check if enough time has passed to move to the next beat, 
    if (timestamp - lastTime >= interval) {
        columnDark(currentCol); // remove playhead highlight from current column
        currentCol = (currentCol + 1) % cols; // move to the next column, looping back to 0
        columnBright(currentCol); // highlight the new next column

        // playing  sounds for all active beats in the current column
        for (let i = 0; i < rows; i++) {
            if (beatPattern[i][currentCol]) {
                sounds[instruments[i]].play();// playing the sound for the active instrjument 
            }
        }

        lastTime = timestamp; // updating the timestamp for the las t beat in lastTime
    }

    requestAnimationFrame(playBeat); // request animation frame to keep it going 
}


playButton.onclick = function() {// toggle the playback state (true: playing, false: stopped)
isPlaying = !isPlaying;
this.textContent = isPlaying ? 'Stop' : 'Play'; // update the button text to indicate the current state (S'top' when the beatmaker is on and playing, 'Play' when stopped)
    if (isPlaying) {     // ff playback has started
        currentCol = -1; //// resetting the playhead to start before the first column
        lastTime = 0;//Resetting timing for the playback loop
        requestAnimationFrame(playBeat);// using playbeat section to begin the playback loop 
    } else {
        clearColumn(currentCol); // clearing the visual highlight on the current column when playback stops
    }
};

createBeatmaker();//initializes beatmaker

document.getElementById('clear-all').onclick = clearAllBeats;

function clearAllBeats() {
    // Reset the beat pattern, 
    for (let i = 0; i < rows; i++) {// Loop through all rows and columns of the beat pattern grid
        for (let j = 0; j < cols; j++) {
            beatPattern[i][j] = false;// setting all beats to "off" (false)
        }
    }

    // resetting the visual appearance of all cells in the grid
    let cells = document.getElementsByClassName('cell')//getting all of the cells in the grid
    for (let i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = '#333';//resetting background color to default
        cells[i].style.boxShadow = 'none';// removing shadow or glow effect 
    }
}