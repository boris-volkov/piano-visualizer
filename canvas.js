const canvas = document.querySelector('#canvas');
canvas.width = 1760;
canvas.height = 1200;
const ctx = canvas.getContext('2d');

let scroll_speed = 1;
const LOWEST_NOTE = 21; // MIDI value of the low A on the Piano
// I could make this an option as well for shorter keyboards, 
// let users enter their highest and lowest key in the options.

let notes_down = {}; // need to be able to access them by key
let notes_on_screen = new Set();


function convertHexToRgba(hex, alpha) {
    // Remove the '#' character from the hex code
    hex = hex.replace('#', '');

    // Parse the hex values for red, green, and blue
    const red = parseInt(hex.substring(0, 2), 16);
    const green = parseInt(hex.substring(2, 4), 16);
    const blue = parseInt(hex.substring(4, 6), 16);

    // Return the converted RGBA string
    return `rgba(${red}, ${green}, ${blue}, %ALPHA%)`;
}

// these keys increment by 7 mod 12, as notes on the circle of fifths
const colorWheel = {
    0: 'rgba(56, 95, 152, %ALPHA%)',       // Blue
    7: 'rgba(45, 120, 176, %ALPHA%)',      // Blue-Violet
    2: 'rgba(56, 145, 185, %ALPHA%)',      // Violet
    9: 'rgba(85, 163, 176, %ALPHA%)',      // Red-Violet
    4: 'rgba(125, 170, 153, %ALPHA%)',     // Red
    11: 'rgba(165, 163, 120, %ALPHA%)',    // Red-Orange
    6: 'rgba(194, 145, 88, %ALPHA%)',      // Orange
    1: 'rgba(205, 120, 64, %ALPHA%)',      // Yellow-Orange
    8: 'rgba(194, 95, 55, %ALPHA%)',       // Yellow
    3: 'rgba(165, 77, 64, %ALPHA%)',       // Yellow-Green
    10: 'rgba(125, 70, 87, %ALPHA%)',      // Green
    5: 'rgba(85, 77, 120, %ALPHA%)'        // Blue-Green
};


function getColorByVelocity(integer, velocity) {
    const velocityExp = Math.pow(velocity, 2); // Apply exponential scaling to velocity

    const alpha = velocityExp / (Math.pow(127, 2)); // Calculate alpha value based on scaled velocity

    // Define the color mappings with RGBA values (using a placeholder for alpha)

    // Get the color based on the integer value
    let color = userColorWheel[integer] || colorWheel[integer];

    // Replace the placeholder with the actual alpha value
    color = color.replace('%ALPHA%', alpha);

    return color;
}

let NOTE_WIDTH = (canvas.width / 88)

class Note {
    constructor(note, velocity) {
        this.width = Math.round((NOTE_WIDTH) * (velocity / 64))
        this.x = (NOTE_WIDTH) * (note - LOWEST_NOTE) + NOTE_WIDTH / 2 - (this.width / 2);
        this.y = canvas.height;
        this.height = 0;
        this.velocity = velocity;
        this.note = note % 12;
    }

    draw() {
        ctx.fillStyle = getColorByVelocity(this.note, this.velocity)
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    extend() {
        this.height = canvas.height - this.y
    }

    raise() {
        this.y -= scroll_speed;
    }
}

let alpha = 0.1;

function clear() {
    ctx.fillStyle = 'rgba(0, 0, 0, %ALPHA%)'.replace('%ALPHA%', alpha);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 1;
}

let interval_id = start_animation();

function start_animation() {
    let id = setInterval(() => {
        clear();

        Object.values(notes_down).forEach(element => {
            element.raise();
            element.extend();
            element.draw();
        });

        let toRemove = [];

        notes_on_screen.forEach(element => {
            if (element.y + element.height < 0) {
                toRemove.push(element);
            } else {
                element.raise();
                element.draw();
            }
        });

        toRemove.forEach(element => {
            notes_on_screen.delete(element);
        });
    }, 30);
    return id;
}

// on each frame we move all the notes up, and the ones that are still held get extended