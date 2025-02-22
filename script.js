const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');

// Game settings
const gridSize = 20;
const cellCount = gridSize * gridSize;
let snake = [{ x: 10, y: 10 }]; // Initial snake position
let food = { x: 5, y: 5 }; // Initial food position
let direction = { x: 0, y: 0 }; // Initial direction
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameInterval;
let gameSpeed = 100; // Milliseconds per frame
let obstacles = []; // Array to store obstacles

// Draw the game board
function drawGame() {
  gameBoard.innerHTML = ''; // Clear the board

  // Draw the snake
  snake.forEach(segment => {
    const snakeElement = document.createElement('div');
    snakeElement.classList.add('cell', 'snake');
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    gameBoard.appendChild(snakeElement);
  });

  // Draw the food
  const foodElement = document.createElement('div');
  foodElement.classList.add('cell', 'food');
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  gameBoard.appendChild(foodElement);

  // Draw obstacles
  obstacles.forEach(obstacle => {
    const obstacleElement = document.createElement('div');
    obstacleElement.classList.add('cell', 'obstacle');
    obstacleElement.style.gridRowStart = obstacle.y;
    obstacleElement.style.gridColumnStart = obstacle.x;
    gameBoard.appendChild(obstacleElement);
  });

  // Update the score
  scoreDisplay.textContent = `Score: ${score} | High Score: ${highScore}`;
}

// Move the snake
function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check for collision with walls
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    gameOver();
    return;
  }

  // Check for collision with itself
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  // Check for collision with obstacles
  if (obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y)) {
    gameOver();
    return;
  }

  // Add new head to the snake
  snake.unshift(head);

  // Check if the snake eats the food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
    }
    placeFood();
    increaseSpeed();
    placeObstacle();
  } else {
    // Remove the tail
    snake.pop();
  }

  drawGame();
}

// Place food randomly
function placeFood() {
  food = {
    x: Math.floor(Math.random() * gridSize) + 1,
    y: Math.floor(Math.random() * gridSize) + 1,
  };

  // Ensure food doesn't spawn on the snake or obstacles
  if (
    snake.some(segment => segment.x === food.x && segment.y === food.y) ||
    obstacles.some(obstacle => obstacle.x === food.x && obstacle.y === food.y)
  ) {
    placeFood();
  }
}

// Place obstacles randomly
function placeObstacle() {
  const obstacle = {
    x: Math.floor(Math.random() * gridSize) + 1,
    y: Math.floor(Math.random() * gridSize) + 1,
  };

  // Ensure obstacles don't spawn on the snake, food, or other obstacles
  if (
    snake.some(segment => segment.x === obstacle.x && segment.y === obstacle.y) ||
    (obstacle.x === food.x && obstacle.y === food.y) ||
    obstacles.some(obs => obs.x === obstacle.x && obs.y === obstacle.y)
  ) {
    placeObstacle();
  } else {
    obstacles.push(obstacle);
  }
}

// Increase game speed as the score increases
function increaseSpeed() {
  if (score % 50 === 0 && gameSpeed > 50) {
    gameSpeed -= 10;
    clearInterval(gameInterval);
    gameInterval = setInterval(moveSnake, gameSpeed);
  }
}

// Handle keyboard input
function handleInput(event) {
  switch (event.key) {
    case 'ArrowUp':
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
}

// Game over
function gameOver() {
  clearInterval(gameInterval);
  alert(`Game Over! Your score is ${score}.`);
  resetGame();
}

// Reset the game
function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  obstacles = [];
  placeFood();
  drawGame();
  gameInterval = setInterval(moveSnake, gameSpeed);
}

// Start the game
document.addEventListener('keydown', handleInput);
resetGame();