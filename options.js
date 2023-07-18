


const notes = ['C    ', 'C♯/D♭', 'D    ', 'D♯/E♭', 'E    ', 'F    ',
               'F♯/G♭', 'G    ', 'G♯/A♭', 'A    ', 'A♯/B♭', 'B    '];
const userColorWheel = {};

const options = document.getElementById('options');
const colorPickersContainer = document.getElementById('colorPickersContainer');
const toggleButton = document.getElementById('toggleButton');
notes.forEach((note, index) => {
    // Create a label for the color picker
    const label = document.createElement('pre');
    label.textContent = note + ': ';
    const holder = document.createElement('div');
    // Create a color picker element
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.id = note + 'ColorPicker';

    // Set the initial color value of the color picker
    if (colorWheel.hasOwnProperty(index)) {
        colorPicker.value = colorToHex(colorWheel[index].replace('%ALPHA%', '1'));
    }

    // Append the label and color picker to the container
    colorPickersContainer.appendChild(holder);
    holder.appendChild(label);
    holder.appendChild(colorPicker);

    // Add an event listener to handle color changes
    colorPicker.addEventListener('input', function (event) {
        const selectedColor = event.target.value;
        // Store the selected color in the userColorWheel object
        userColorWheel[index] = convertHexToRgba(selectedColor);
        // Use the color in your application as needed
        console.log(note + ' color:', selectedColor);
    });
});

function colorToHex(color) {
    const rgba = color.match(/\d+/g);
    const hex = rgba.slice(0, 3)
        .map(value => parseInt(value).toString(16).padStart(2, '0'))
        .join('');
    return `#${hex}`;
}

function colorToHex(color) {
    const rgba = color.match(/\d+/g);
    const hex = rgba.slice(0, 3)
        .map(value => parseInt(value).toString(16).padStart(2, '0'))
        .join('');
    return `#${hex}`;
}

toggleButton.addEventListener('click', function () {
    // Toggle the visibility of the options container
    options.style.display = (options.style.display === 'none') ? 'flex' : 'none';
    // Get the computed background color
    toggleButton.classList.toggle('active');
    toggleButton.innerHTML = (toggleButton.innerHTML == 'Options') ? 'Done' : 'Options';
});



let cursorTimeout;
let optionsButton = document.getElementById("toggleButton");

function hideCursor() {
    if (!toggleButton.classList.contains('active')) {
        document.body.style.cursor = 'none';
        optionsButton.style.display = 'none';
    }
}

function showCursor() {
    document.body.style.cursor = 'default';
    optionsButton.style.display = 'block';
    clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(hideCursor, 500); // Adjust the duration of inactivity before hiding the cursor (in milliseconds)
}

document.addEventListener('mousemove', showCursor);
hideCursor(); // Hide the cursor initially


const scrollSpeedSlider = document.getElementById('scrollSpeedSlider');

scrollSpeedSlider.addEventListener('input', function (event) {
    scroll_speed = event.target.value;
});