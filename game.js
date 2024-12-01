const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Paddle properties
const paddle = {
  width: 150,
  height: 20,
  x: canvas.width / 2 - 75,
  y: canvas.height - 30,
  color: 'blue',
  speed: 10
};

// Ball properties
const balls = [
  { x: Math.random() * canvas.width, y: 0, radius: 15, speedY: 4, color: 'red' }
];

// Power-ups
const powerUps = [];

// Game variables
let score = 0;
let lives = 3;
let gameOver = false;

// Event listeners for touch
canvas.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  const touchX = touch.clientX;
  paddle.x = touchX - paddle.width / 2;
});

// Game loop
function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddle
  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  // Draw balls
  balls.forEach((ball, index) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    // Move ball
    ball.y += ball.speedY;

    // Check for collision
    if (
      ball.y + ball.radius >= paddle.y &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.width
    ) {
      ball.speedY = -Math.abs(ball.speedY);
      ball.y = paddle.y - ball.radius;
      score++;
      if (score % 5 === 0) spawnBall(); // Add new ball every 5 points
    }

    // Ball falls off screen
    if (ball.y > canvas.height) {
      balls.splice(index, 1);
      lives--;
      if (lives <= 0) endGame();
    }

    // Bounce off walls
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
      ball.speedY = -ball.speedY;
    }
  });

  // Draw power-ups
  powerUps.forEach((power, index) => {
    ctx.fillStyle = power.color;
    ctx.fillRect(power.x, power.y, power.size, power.size);
    power.y += power.speed;

    // Check if collected
    if (
      power.y + power.size > paddle.y &&
      power.x + power.size > paddle.x &&
      power.x < paddle.x + paddle.width
    ) {
      activatePowerUp(power.type);
      powerUps.splice(index, 1);
    }

    // Remove off-screen power-ups
    if (power.y > canvas.height) {
      powerUps.splice(index, 1);
    }
  });

  // Display score and lives
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Lives: ${lives}`, 10, 60);

  // Increase ball speed over time
  balls.forEach((ball) => {
    ball.speedY += 0.005;
  });

  requestAnimationFrame(gameLoop);
}

// Add a new ball
function spawnBall() {
  balls.push({
    x: Math.random() * canvas.width,
    y: 0,
    radius: 15,
    speedY: 4 + Math.random() * 2,
    color: getRandomColor()
  });

  if (Math.random() < 0.3) spawnPowerUp(); // 30% chance for power-up
}

// Spawn a power-up
function spawnPowerUp() {
  const types = ['LARGER_PADDLE', 'EXTRA_LIFE'];
  const type = types[Math.floor(Math.random() * types.length)];
  powerUps.push({
    x: Math.random() * canvas.width,
    y: 0,
    size: 20,
    speed: 3,
    color: type === 'LARGER_PADDLE' ? 'green' : 'yellow',
    type: type
  });
}

// Activate a power-up
function activatePowerUp(type) {
  if (type === 'LARGER_PADDLE') {
    paddle.width += 50;
    setTimeout(() => (paddle.width = 150), 5000); // Revert after 5 seconds
  } else if (type === 'EXTRA_LIFE') {
    lives++;
  }
}

// End the game
function endGame() {
  gameOver = true;
  ctx.font = '40px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText(`Game Over! Your score: ${score}`, canvas.width / 2, canvas.height / 2);
  ctx.fillText(`Tap to Restart`, canvas.width / 2, canvas.height / 2 + 50);

  canvas.addEventListener('touchstart', restartGame, { once: true });
}

// Restart the game
function restartGame() {
  balls.length = 1; // Keep only one ball
  balls[0] = { x: Math.random() * canvas.width, y: 0, radius: 15, speedY: 4, color: 'red' };
  powerUps.length = 0;
  score = 0;
  lives = 3;
  gameOver = false;
  gameLoop();
}

// Get a random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Start the game
gameLoop();
