//Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('start-instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

//Define Game Varieables
const gridSize = 20;
let snake = [{x: 10, y: 10}]
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

//BLINK TEXT
function blinkInstructionText(){
    instructionText.style.visibility = (instructionText.style.visibility === 'hidden' ? 'visible' : 'hidden');
}

// Function to mute sound
function toggleMute(){
    const startGameSound = document.getElementById('startGameSound');
    const gameOverSound = document.getElementById('gameOverSound');
    const eatSound = document.getElementById('eatSound');
    const soundIcon = document.getElementById('soundIcon');

    startGameSound.muted = !startGameSound.muted;
    gameOverSound.muted = !gameOverSound.muted;
    eatSound.muted = !eatSound.muted;

    soundIcon.classList.toggle('muted', startGameSound.muted || gameOverSound.muted || eatSound.muted);
}

// Init audio 
document.addEventListener('DOMContentLoaded', function(){
    const startGameSound = document.getElementById('startGameSound');
    const gameOverSound = document.getElementById('gameOverSound');
    const eatSound = document.getElementById('eatSound');

    startGameSound.muted = false;
    gameOverSound.muted = false;
    eatSound.muted = false;
})

// Function to make sound when eats an apple
function playEatSound(){
    const eatSound = document.getElementById('eatSound');
    eatSound.play().then().catch(error => {
        console.error('Error playing eat sound:', error);
    })
}

// Function to make sound when game over
function playgameOverSound(){
    const gameOverSound = document.getElementById('gameOverSound');
    gameOverSound.play().then().catch(error => {
        console.error('Error playing game over sound:', error);
    })
}

// Function to make sound when press spacebar to star
function playstartGameSound(){
    const startGameSound = document.getElementById('startGameSound');
    startGameSound.play().then().catch(error => {
        console.error('Error playing start game sound:', error);
    })
}

// text blink every 500 milliseconds
const blinkInterval = setInterval(blinkInstructionText, 500);

// Draw Game Map, Snake, Food
function draw(){
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

//Draw Snake
function drawSnake(){
    snake.forEach((segmemt) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segmemt);
        board.appendChild(snakeElement);
    })
}

//Create a Snake or Food cube/div
function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

//Set the Position of The Snake or the Food
function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

//draw food function
function drawFood(){
    if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
    }
}

// generate food
function generateFood(){
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return{x, y};
}

//moving the snake
function move() {
    const head = {...snake[0]};
    switch (direction){
        case 'up':
            head.y--;
            break;
            
        case 'down':
            head.y++;
            break;

        case 'left':
            head.x--;
            break;

        case 'right':
            head.x++;
            break;
    }

    snake.unshift(head);
    
    if(head.x === food.x && head.y === food.y){
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); //clear past interval
        gameInterval = setInterval(() =>{
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
         //playing sound
        playEatSound();
    } else {
        snake.pop();
    }
}

//star game function
function starGame(){
    gameStarted = true; // keep track of a running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() =>{
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//keypress event listener
function handleKeyPress(event){
    if((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ')){
        starGame();
        playstartGameSound();
    } else {
        switch (event.key){
            case 'ArrowUp':
                direction = 'up';
                break;

            case 'ArrowDown':
                direction = 'down';
                break;

            case 'ArrowLeft':
                direction = 'left';
                break;

            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed(){
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100){
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50){
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25){
        gameSpeedDelay -= 1;
    }
}

function checkCollision (){
    const head = snake[0];

    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }

    for (let i =1; i < snake.length; i++){
        if (head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}

function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x:10, y:10}]
    food =  generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
    playgameOverSound();
}

function updateScore(){
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}


function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore(){
    const currentScore = snake.length - 1;
    if(currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}