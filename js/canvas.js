const canvasEl = document.querySelector('canvas');
const ctx = canvasEl.getContext('2d');

let balls = [];
let ballsCount = 760;
let shouldExplode = false;
let gravityCoords = [];
const colors = ['#2c3e50', '#e74c3c', '#bcf0f1', '#3498db', '#2980b9'];

function generateRandomColor(length) {
  return Math.floor(Math.random() * length);
}

function randomFloatFromRange(min, max) {
  return Math.random() * (max - min + 1) + min;
}

canvasEl.width = innerWidth;
canvasEl.height = innerHeight;

const mouseCoords = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

addEventListener('mousemove', (event) => {
  mouseCoords.x = event.clientX;
  mouseCoords.y = event.clientY;

  gravityCoords = [mouseCoords.x, mouseCoords.y];
});

addEventListener('mouseout', () => {
  gravityCoords = [canvasEl.width / 2, canvasEl.height / 2];
});

addEventListener('resize', () => {
  canvasEl.width = innerWidth;
  canvasEl.height = innerHeight;

  init();
});

addEventListener('click', () => {
  init();
});

class Ball {
  constructor({ x, y }, { dx, dy }, radius) {
    this.position = { x, y };
    this.radius = radius;
    this.color = colors[generateRandomColor(colors.length)];
    this.gravityPosition = { gx: 0, gy: 0 };
    this.velocity = { dx, dy };
    this.gravityIntensity = 0;
    this.friction = 0.985;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  update() {
    this.draw();

    this.gravityPosition.gx = gravityCoords[0] - this.position.x;
    this.gravityPosition.gy = gravityCoords[1] - this.position.y;

    let a = gravityCoords[0] - this.position.x;
    let b = gravityCoords[1] - this.position.y;

    this.gravityIntensity = 1 / Math.sqrt(a * a + b * b);

    if (shouldExplode) {
      this.gravityPosition.gx *= randomFloatFromRange(-10, 10);
      this.gravityPosition.gy *= randomFloatFromRange(-10, 10);
    }

    this.velocity.dx *= this.friction;
    this.velocity.dy *= this.friction;

    this.velocity.dx += this.gravityPosition.gx * this.gravityIntensity * this.friction;
    this.velocity.dy += this.gravityPosition.gy * this.gravityIntensity * this.friction;

    this.position.x += this.velocity.dx;
    this.position.y += this.velocity.dy;
  }
}

function init() {
  gravityCoords = [canvasEl.width / 2, canvasEl.height / 2];

  balls = [];
  for (let i = 0; i < ballsCount; i++) {
    let radius = randomFloatFromRange(3, 10);

    let { x, y } = {
      x: randomFloatFromRange(0, canvasEl.width),
      y: randomFloatFromRange(0, canvasEl.height),
    };

    let { dx, dy } = {
      dx: randomFloatFromRange(-10, 10),
      dy: randomFloatFromRange(-10, 10),
    };

    balls.push(new Ball({ x, y }, { dx, dy }, radius));
  }
}

function shouldBallsExplode() {
  let x = 0;
  let y = 0;

  for (let i = 0; i < balls.length; i++) {
    x += balls[i].velocity.dx < 0 ? balls[i].velocity.dx * -1 : balls[i].velocity.dx;
    y += balls[i].velocity.dy < 0 ? balls[i].velocity.dy * -1 : balls[i].velocity.dy;

    shouldExplode = x / balls.length < 1 && y / balls.length < 1;
  }
}

function animate() {
  requestAnimationFrame(animate);

  shouldBallsExplode();

  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

  balls.forEach((ball) => {
    ball.update();
  });
}

init();
animate();
