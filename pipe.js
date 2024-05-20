// Constants for the pipe behavior

const HOLE_HEIGHT = 200; // Height of the hole between top and bottom pipes
const PIPE_WIDTH = 120; // Width of each pipe
const PIPE_INTERVAL = 600; // Time interval (ms) between pipe creation
const PIPE_SPEED = 1; // Speed at which pipes move to the left

// Variables to track pipes, time since the last pipe was created, and passed pipes count
let pipes = [];
let timeSinceLastPipe;
let passedPipeCount;

// Function to set up initial pipe properties
export function setupPipes() {
    // Set CSS properties for pipe width and hole height
    document.documentElement.style.setProperty("--pipe-width", PIPE_WIDTH);
    document.documentElement.style.setProperty("--hole-height", HOLE_HEIGHT);
    // Remove existing pipes from the DOM
    pipes.forEach(pipe => pipe.remove());
    // Reset time since last pipe creation and passed pipes count
    timeSinceLastPipe = PIPE_INTERVAL;
    passedPipeCount = 0;
}

// Function to update pipes position and create new pipes as needed
export function updatePipes(delta) {
    // Update time since the last pipe was created
    timeSinceLastPipe += delta;

    // If it's time to create a new pipe
    if (timeSinceLastPipe > PIPE_INTERVAL) {
        // Reset time since the last pipe creation
        timeSinceLastPipe -= PIPE_INTERVAL;
        // Create a new pipe
        createPipe();
    }

    // Update each pipe's position and remove if it goes off-screen
    pipes.forEach(pipe => {
        // If the pipe is completely off the left side of the screen
        if (pipe.left + PIPE_WIDTH < 0) {
            passedPipeCount++; // Increment passed pipe count
            return pipe.remove(); // Remove the pipe from the DOM and array
        }
        // Move the pipe to the left based on the delta time and pipe speed
        pipe.left = pipe.left - delta * PIPE_SPEED;
    });
}

// Function to get the count of passed pipes
export function getPassedPipesCount() {
    return passedPipeCount;
}

// Function to get bounding rectangles of all pipe segments
export function getPipeRects() {
    // Flatten the array of pipe rectangles
    return pipes.flatMap(pipe => pipe.rects());
}

// Function to create a new pipe and add it to the DOM
function createPipe() {
    // Create the main pipe element
    const pipeElem = document.createElement('div');
    // Create top and bottom pipe segments
    const topElem = createPipeSegment('top');
    const bottomElem = createPipeSegment('bottom');
    // Append pipe segments to the main pipe element
    pipeElem.append(topElem);
    pipeElem.append(bottomElem);
    // Add the pipe class for styling
    pipeElem.classList.add('pipe');
    // Set a random top position for the hole in the pipe
    pipeElem.style.setProperty(
        '--hole-top',
        randomNumberBetween(
            HOLE_HEIGHT * 1.5,
            window.innerHeight - HOLE_HEIGHT * 0.5
        )
    );

    // Define the pipe object with methods to get/set left position, remove itself, and get bounding rectangles
    const pipe = {
        get left() {
            return parseFloat(
                getComputedStyle(pipeElem).getPropertyValue("--pipe-left")
            );
        },
        set left(value) {
            pipeElem.style.setProperty("--pipe-left", value);
        },
        remove() {
            // Filter out this pipe from the pipes array
            pipes = pipes.filter(p => p !== pipe);
            // Remove the pipe element from the DOM
            pipeElem.remove();
        },
        rects() {
            // Return bounding rectangles of top and bottom segments
            return [
                topElem.getBoundingClientRect(),
                bottomElem.getBoundingClientRect(),
            ];
        },
    };

    // Set the initial left position of the pipe to the right edge of the screen
    pipe.left = window.innerWidth;
    // Append the pipe element to the document body
    document.body.append(pipeElem);
    // Add the pipe object to the pipes array
    pipes.push(pipe);
}

// Function to create a pipe segment (top or bottom)
function createPipeSegment(position) {
    const segment = document.createElement('div');
    segment.classList.add('segment', position);
    return segment;
}

// Function to generate a random number between min and max (inclusive)
function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
