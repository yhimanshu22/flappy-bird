// Select the bird element from the DOM
const birdElem = document.querySelector('[data-bird]');

// Constants for bird's speed and jump duration
const BIRD_SPEED = 0.5; // Speed at which the bird moves up or down
const JUMP_DURATION = 123; // Duration of the bird's jump in milliseconds

// Variable to track time since the last jump
let timeSinceLastJump = Number.POSITIVE_INFINITY;

// Function to set up the bird's initial position and event listener for jumping
export function setupBird() {
    // Set the bird's initial vertical position to the middle of the window
    setTop(window.innerHeight / 2);
    // Remove any existing event listener for the 'keydown' event to avoid duplicates
    document.removeEventListener('keydown', handleJump);
    // Add an event listener for the 'keydown' event to handle the bird's jump
    document.addEventListener('keydown', handleJump);
}

// Function to update the bird's position based on the time delta
export function updateBird(delta) {
    // If the bird is in the jump duration, move it up
    if (timeSinceLastJump < JUMP_DURATION) {
        setTop(getTop() - BIRD_SPEED * delta);
    } else { // Otherwise, move the bird down
        setTop(getTop() + BIRD_SPEED * delta);
    }
    // Increment the time since the last jump by the delta time
    timeSinceLastJump += delta;
}

// Function to get the bounding rectangle of the bird element for collision detection
export function getBirdRect() {
    return birdElem.getBoundingClientRect();
}

// Function to set the bird's vertical position (top) in the CSS
function setTop(top) {
    birdElem.style.setProperty('--bird-top', top);
}

// Function to get the bird's current vertical position (top) from the CSS
function getTop() {
    return parseFloat(getComputedStyle(birdElem).getPropertyValue('--bird-top'));
}

// Function to handle the bird's jump when the spacebar is pressed
function handleJump(e) {
    // If the pressed key is not the spacebar, do nothing
    if (e.code !== 'Space') return;
    // Reset the time since the last jump to 0 to start the jump
    timeSinceLastJump = 0;
}
