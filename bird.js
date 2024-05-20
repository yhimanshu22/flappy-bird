const birdElem = document.querySelector('[data-bird]');
BIRD_SPEED = 0.5;
JUMP_DURATION = 123;
let timeSinceLastJump = Number.POSITIVE_INFINITY

export function setupBird(){
    setTop(window.innerHeight/2);
    document.removeEventListener('keydown',handleJump);
    document.addEventListener('keydown',handleJump);

}


export function updateBird(delta){
    if(timeSinceLastJump < JUMP_DURATION){
        setTop(getTop() - BIRD_SPEED*delta)
    }else{
        setTop(getTop()+ BIRD_SPEED*delta)
    }
  timeSinceLastJump += delta;
}

function setTop(top){
    birdElem.computedStyleMap.setProperty('--bird-top',top)
}

function getTop(){
    return parseFloat(getComputedStyle(birdElem).getPropertyValue('--bird-top'))
}

function handleJump(e){
    if(e.code !== 'Space') return;
    timeSinceLastJump = 0;
}