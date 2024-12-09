let grid = document.getElementById('grid');
let labels = document.getElementById('labels');
let playButton = document.getElementById('play-button');
let bpmInput = document.getElementById('bpm');

let rows = 8;
let cols = 16;

let instruments = ['Kick', 'Snare', 'Hihat', 'Tom', 'Clap', 'Open Hat', 'Ride', 'Snap'];
let colors = ['#D63230', '#48C210', '#4149D9', '#C21B5E', '#EE7809', '#01BB83', '#7C1BC2', '#8F9606'];

let beatPattern = Array(rows).fill().map(() => Array(cols).fill(false));

let isPlaying = false;
let currentCol = 0;
let lastTime = 0;

let sounds = {};
for (let i = 0; i < instruments.length; i++) {
    sounds[instruments[i]] = new Howl({
        src: ['Sounds/beatmaker' + instruments[i].toLowerCase().replace(' ', '') + '.mp3']
    });
}

function createBeatmaker() {
    for (let i = 0; i < instruments.length; i++) {
        let label = document.createElement('div');
        label.className = 'label';
        label.style.backgroundColor = colors[i];
        label.textContent = instruments[i];
        labels.appendChild(label);
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.onclick = function() { toggleCell(this); };
            grid.appendChild(cell);
        }
    }
}

function toggleCell(cell) {
    let row = Number(cell.dataset.row);
let col = Number(cell.dataset.col);

if (beatPattern[row][col] === true) {
    beatPattern[row][col] = false;
} else {
    beatPattern[row][col] = true;
}
    if (beatPattern[row][col] === true) {
        cell.style.backgroundColor = colors[row];
    } else {
        cell.style.backgroundColor = '#333';
    }
}

function columnBright(col) {
    let boxes = document.querySelectorAll(`[data-col="${col}"]`);
    for (let box of boxes) {
        box.style.border = '2px solid white';
    }
}

function columnDark(col) {
    let boxes = document.querySelectorAll(`[data-col="${col}"]`);
    for (let box of boxes) {
        box.style.border = 'none';
    }
}

function playBeat(timestamp) {
    if (!isPlaying) return;

    // Calculate the time between beats based on BPM
    let interval = 60000 / (bpmInput.value * 4);

    // Initialize lastTime if it's not set
    if (!lastTime) lastTime = timestamp;

    // Check if enough time has passed to move to the next beat
    if (timestamp - lastTime >= interval) {
        columnDark(currentCol); // Remove playhead highlight from current column
        currentCol = (currentCol + 1) % cols; // Move to the next column, looping back to 0
        columnBright(currentCol); // Highlight the new column

        // Play sounds for all active beats in the current column
        for (let i = 0; i < rows; i++) {
            if (beatPattern[i][currentCol]) {
                sounds[instruments[i]].play();
            }
        }

        lastTime = timestamp; // Update lastTime to the current timestamp
    }

    requestAnimationFrame(playBeat); // Continue animating
}


playButton.onclick = function() {
isPlaying = !isPlaying;
this.textContent = isPlaying ? 'Stop' : 'Play';
    if (isPlaying) {
        currentCol = -1;
        lastTime = 0;
        requestAnimationFrame(playBeat);
    } else {
        clearColumn(currentCol);
    }
};

createBeatmaker();

document.getElementById('clear-all').onclick = clearAllBeats;

function clearAllBeats() {
    // Reset the beat pattern
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            beatPattern[i][j] = false;
        }
    }

    // Reset all cell colors
    let cells = document.getElementsByClassName('cell')
    for (let i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = '#333';
        cells[i].style.boxShadow = 'none';
    }
}