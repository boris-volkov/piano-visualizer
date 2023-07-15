const canvas = document.querySelector('#canvas');
canvas.width = 880;
canvas.height = 500;
const ctx = canvas.getContext('2d'); 

const scroll_speed = 1;
const LOWEST_NOTE = 21;

let notes_down = {}; // need to be able to access them by key
let notes_on_screen = new Set();

const colormap = {
    0: '#0000FF', // Blue
    7: '#8130B2', // Blue-Violet
    2: '#B86EDB', // Violet
    9: '#FF26FF', // Red-Violet
    4: '#FF3030', // Red
    11: '#FF6B32', // Red-Orange
    6: '#FFA83F', // Orange
    1: '#FFD842', // Yellow-Orange
    8: '#F2FF46', // Yellow
    3: '#ACFF6E', // Yellow-Green
    10: '#45FF45', // Green
    5: '#00C4C4' // Blue-Green
};

function getColorByVelocity(integer, velocity) {
    const velocityExp = Math.pow(velocity, 2); // Apply exponential scaling to velocity
  
    const alpha = velocityExp / (Math.pow(127, 2)); // Calculate alpha value based on scaled velocity
    
  
  // Define the color mappings with RGBA values (using a placeholder for alpha)
  const colorWheel = {
    0: 'rgba(0, 0, 255, %ALPHA%)', // Blue
    7: 'rgba(129, 48, 178, %ALPHA%)', // Blue-Violet
    2: 'rgba(184, 110, 219, %ALPHA%)', // Violet
    9: 'rgba(255, 38, 255, %ALPHA%)', // Red-Violet
    4: 'rgba(255, 48, 48, %ALPHA%)', // Red
    11: 'rgba(255, 107, 50, %ALPHA%)', // Red-Orange
    6: 'rgba(255, 168, 63, %ALPHA%)', // Orange
    1: 'rgba(255, 216, 66, %ALPHA%)', // Yellow-Orange
    8: 'rgba(242, 255, 70, %ALPHA%)', // Yellow
    3: 'rgba(172, 255, 110, %ALPHA%)', // Yellow-Green
    10: 'rgba(69, 255, 69, %ALPHA%)', // Green
    5: 'rgba(0, 196, 196, %ALPHA%)' // Blue-Green
  };
  
  // Get the color based on the integer value
  let color = colorWheel[integer];
  
  // Replace the placeholder with the actual alpha value
  color = color.replace('%ALPHA%', alpha);
  
  return color;
}
  
class Note {
    constructor(note, velocity) {
        this.x = (canvas.width / 88) * (note - LOWEST_NOTE) ;
        this.y = canvas.height;
        this.width = canvas.width / 88;
        this.height = 0;
        this.velocity = velocity;
        this.note = note%12;
    }

    draw () {
        ctx.fillStyle = getColorByVelocity(this.note, this.velocity)
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    extend () {
        this.height = canvas.height - this.y
    }

    raise() {
        this.y -= scroll_speed;
    }
}

function clear () {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 1;
}

let interval_id = start_animation();

function start_animation(){
	let id = setInterval( () => {
		clear();

        Object.values(notes_down).forEach(element => {
            element.raise();
            element.extend();
            element.draw();
        });

        let toRemove = [];

        notes_on_screen.forEach( element => {
            if (element.y + element.height < 0){
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