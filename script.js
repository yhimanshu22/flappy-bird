// Import functions from bird.js and pipe.js modules
import { updateBird, setupBird, getBirdRect } from './bird.js';
import { updatePipes, setupPipes, getPassedPipesCount, getPipeRects } from './pipe.js';

// Add an event listener to start the game on keypress, only once
document.addEventListener('keypress', handleStart, { once: true });

// Get references to the title and subtitle elements in the DOM
const title = document.querySelector('[data-title]');
const subtitle = document.querySelector('[data-subtitle]');

// Variable to track the last time the game loop was updated
let lastTime;

// The main game loop function, called repeatedly by requestAnimationFrame
function updateLoop(time) {
    // If lastTime is null, set it to the current time and request the next frame
    if (lastTime == null) {
        lastTime = time;
        window.requestAnimationFrame(updateLoop);
        return;
    }

    // Calculate the time difference (delta) since the last frame
    const delta = time - lastTime;

    // Update the bird and pipes based on the time difference
    updateBird(delta);
    updatePipes(delta);

    // Check if the game is lost and handle it if necessary
    if (checkLose()) return handleLose();

    // Update lastTime to the current time and request the next frame
    lastTime = time;
    window.requestAnimationFrame(updateLoop);
}

// Function to check if the game is lost (bird collides with pipe or goes out of bounds)
function checkLose() {
    // Get the rectangle representing the bird's position
    const birdRect = getBirdRect();

    // Check if the bird is inside any pipe
    const insidePipe = getPipeRects().some(rect => isCollision(birdRect, rect));

    // Check if the bird is outside the bounds of the screen
    const outsideWorld = birdRect.top < 0 || birdRect.bottom > window.innerHeight;

    // Return true if the bird is outside the bounds or inside a pipe
    return outsideWorld || insidePipe;
}

// Function to check if two rectangles are colliding
function isCollision(rect1, rect2) {
    return (
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
    );
}

// Function to handle the start of the game
function handleStart() {
    // Hide the title element
    title.classList.add('hide');

    // Set up the bird and pipes for the game start
    setupBird(); // Start from the middle
    setupPipes();

    // Reset lastTime and start the game loop
    lastTime = null;
    window.requestAnimationFrame(updateLoop);
}

// Function to handle when the game is lost
function handleLose() {
    // Show the title and subtitle after a short delay
    setTimeout(() => {
        title.classList.remove('hide');
        subtitle.classList.remove('hide');

        // Update the subtitle with the number of passed pipes
        subtitle.textContent = `${getPassedPipesCount()} Pipes`;

        // Add an event listener to restart the game on keypress, only once
        document.addEventListener("keypress", handleStart, { once: true });
    }, 100);
}
