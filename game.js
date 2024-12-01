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
const ball = {
  x: Math.random() * canvas.width,
  y: 0,
  radius: 15,
  speedY: 4,
  color: 'red'
};

// Game variables
let score = 0;
let lives = 3;

// Event listeners for touch
canvas.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  const touchX = touch.clientX;
  paddle.x = touchX - paddle.width / 2;
});

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddle
  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  // Draw ball
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
    ball.speedY = -ball.speedY;
    ball.y = paddle.y - ball.radius;
    score++;
  }

  // Ball falls off screen
  if (ball.y > canvas.height) {
    lives--;
    resetBall();
    if (lives <= 0) {
      alert(`Game Over! Your score: ${score}`);
      resetGame();
    }
  }

  // Bounce off walls
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.speedY = -ball.speedY;
  }

  // Display score and lives
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Lives: ${lives}`, 10, 60);

  requestAnimationFrame(gameLoop);
}

// Reset the ball
function resetBall() {
  ball.x = Math.random() * canvas.width;
  ball.y = 0;
}

// Reset the game
function resetGame() {
  score = 0;
  lives = 3;
  resetBall();
}

// Start the game
gameLoop();
