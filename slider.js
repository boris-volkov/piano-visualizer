scroll_speed = 1

const sliderThumb = document.getElementById('sliderThumb');
const sliderWidth = sliderThumb.parentElement.offsetWidth - sliderThumb.offsetWidth;

let isDragging = false;
let startX = 0;
let thumbLeft = 0;

sliderThumb.addEventListener('mousedown', handleThumbMouseDown);
document.addEventListener('mousemove', handleThumbMouseMove);
document.addEventListener('mouseup', handleThumbMouseUp);

function handleThumbMouseDown(event) {
  isDragging = true;
  startX = event.clientX;
  thumbLeft = parseInt(getComputedStyle(sliderThumb).left) || 0;
}

function handleThumbMouseMove(event) {
  if (isDragging) {
    const diffX = event.clientX - startX;
    const newLeft = thumbLeft + diffX;

    const minLeft = 0;
    const maxLeft = sliderWidth;
    const clampedLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));

    sliderThumb.style.left = `${clampedLeft}px`;

    const range = 10;
    const value = Math.round((clampedLeft / maxLeft) * range);

    // Update the scroll_speed variable
    scroll_speed = value;
  }
}

function handleThumbMouseUp() {
  isDragging = false;
}
