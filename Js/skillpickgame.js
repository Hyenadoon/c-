// Общее количество баллов за игру 
let totalPoints = 0;

// Значения параметров умений для секции 2
let params = {
  intellect: 0,
  strength: 0,
  creativity: 0
};

let gameStarted = null;
let SnakeStarted = null;

let snake;
let food;
let resolution = 40; // разрешение сетки для движения руки, должно быть чётное 
let headSize = 90; // размер руки 
let snakeHead;
let foodColor ; 
let starContainer;
let restartBtn;
let messageDiv;
let eatenFoodCount = 0;

let gameDuration = 24000; // длительность игры 
let timerValue = gameDuration / 1000;

function preload() {
    snakeHead = loadImage('/Images/snakehead_top.svg'); // Подгружаем картинку руки для головы змейки
  }

function setup() {
  let cnv = createCanvas(800, 800);
  cnv.id('myCanvas'); // задаём class для холста, чтобы ему можно было задать стили через CSS
  cnv.parent ("game-canvas-parent");
  frameRate(10);
  snake = new Snake();
  foodLocation();
  colorMode(HSB, 100);
  starContainer = document.getElementById('star-container');
  restartBtn = document.getElementById('restart-btn');
  restartBtn.addEventListener('click', restartGame);
  messageDiv = document.getElementById('message');

}

// функция, которая обновляет счётчик баллов для игры 2

function updateDisplayTotal() {
  document.getElementById('points').textContent = totalPoints;
}

function TimerStart() {
  if(gameStarted!== null)
  {
    clearTimeout(gameStarted);
  }
  gameStarted = setTimeout(endGame, gameDuration)
  const StartButton = document.getElementById('start-btn');
  StartButton.style.display = 'none';
  SnakeStarted = true;
  gameTimer = setInterval(updateTimerDisplay, 1000);
}

function updateTimerDisplay() {
  timerValue--;
  document.getElementById('time').textContent = timerValue;
}

function foodLocation() {
  let cols = floor(width / resolution);
  let rows = floor(height / resolution);
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(resolution);
  foodColor = color(random(360), random(100), 100); // генерирует случайный цвет для умений 
}

function keyPressed() {
  if (SnakeStarted) {
      if (keyCode === UP_ARROW) {
        snake.setDirection(0, -1);
      } else if (keyCode === DOWN_ARROW) {
        snake.setDirection(0, 1);
      } else if (keyCode === LEFT_ARROW) {
        snake.setDirection(-1, 0);
      } else if (keyCode === RIGHT_ARROW) {
        snake.setDirection(1, 0);
      }
 }
}

function draw() {
  background(0);

  smooth();

  if (snake.eat(food)) {
    foodLocation();
    addStarToScale();
    eatenFoodCount++;
    totalPoints++;
    updateDisplayTotal();
  }
  snake.update();
  snake.show();

  if (snake.endGame()) {
    print('END GAME');
    background(0, 0, 100);
    restartBtn.style.display = 'block'; // показать кнопку рестарт 
    clearTimeout(gameStarted);
    clearInterval(gameTimer);
    noLoop();
  }

//let remainingTime = max(0, gameDuration - millis());
//let seconds = Math.ceil(remainingTime / 1000);
//timeSpan.textContent = seconds;

//if (remainingTime <= 0) {
// background(0, 0, 100);
//}

  noStroke();
  fill(foodColor);
  let pulse = sin(frameCount * 1); // настройка скорости пульсации
  pulse_radius_biggest = (40 * 0.7) + pulse * 10; 
  pulse_radius_lowest = (40 * 0.35) + pulse * 10; 
  drawStar(food.x + resolution / 2, food.y + resolution / 2, pulse_radius_lowest, pulse_radius_biggest); // секция отрисовывает умения как пульсирующие звёзды
}

function drawStar(x, y, radius1, radius2) {
  let angle = TWO_PI / 4;
  beginShape();
  for (let a = -PI / 2; a < TWO_PI - PI / 2; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + angle / 2) * radius1;
    sy = y + sin(a + angle / 2) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function addStarToScale() {
  let star = document.createElement('div');
  star.classList.add('star');
  starContainer.appendChild(star);
}

class Snake {
  constructor() {
    this.body = [];
    this.body[0] = createVector(floor(width / 2), floor(height / 2));
    this.xspeed = 0;
    this.yspeed = 0;
    this.len = 0;
  }

  setDirection(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  update() {
    let head = this.body[this.body.length - 1].copy();
    this.body.shift();
    head.x += this.xspeed * resolution;
    head.y += this.yspeed * resolution;

    // когда рука касается границы холста, она выходит с противоположной 
    head.x = (head.x + width) % width;
    head.y = (head.y + height) % height;

    this.body.push(head);
  }

  grow() {
    let head = this.body[this.body.length - 1].copy();
    this.len++;
    this.body.push(head);
  }

  endGame() {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    if (x > width - resolution || x < 0 || y > height - resolution || y < 0) {
      return true;
    }
    for (let i = 0; i < this.body.length - 1; i++) {
      let part = this.body[i];
      if (part.x === x && part.y === y) {
        return true;
      }
    }
    return false;
  }

  eat(pos) {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    if (x === pos.x && y === pos.y) {
      this.grow();
      return true;
    }
    return false;
  }
  

  show() {
    for (let i = 0; i < this.body.length; i++) {
        if (i === this.body.length - 1) {
            let angle = 0;
            if (this.xspeed === 1) {
              angle = HALF_PI;
            } else if (this.xspeed === -1) {
              angle = -HALF_PI;
            } else if (this.yspeed === 1) {
              angle = PI;
            }
            push();
            translate(this.body[i].x + resolution / 2, this.body[i].y + resolution / 2);
            rotate(angle);
            image(snakeHead, -headSize / 2, -headSize / 2, headSize, headSize);
            pop(); // секция отвечает за использование картинки в качестве головы, а так же делает так, чтобы голова всегда смотрела по направлению движения
          } else {
      fill(255);
      noStroke();
      rect(this.body[i].x, this.body[i].y, resolution, resolution);
    }
  }
}
}

function restartGame() {
  clearTimeout(gameStarted);
  snake = new Snake();
  foodLocation();
  starContainer.innerHTML = ''; 
  restartBtn.style.display = 'none'; 
  messageDiv.style.display = 'none'; 
  location.reload();
  noLoop();
  clearInterval(gameTimer);
}

function endGame() {
  messageDiv.style.display = 'block'; 
  clearTimeout(gameStarted); 
  noLoop();
  clearInterval(gameTimer);
}







// cекция игры 2





document.addEventListener('DOMContentLoaded', function() {

// Функция обновления отображения значений параметров
function updateDisplay() {
  document.getElementById('points').textContent = totalPoints;
  document.getElementById('intellect').textContent = params.intellect;
  document.getElementById('creativity').textContent = params.creativity;
  document.getElementById('strength').textContent = params.strength;

  // Проверяем, все ли баллы распределены
  if (totalPoints === 0) {
      document.getElementById('confirmation-popup').style.display = 'block';
  } 
}

// Функция обработки нажатия кнопки "+"
function handlePlusButtonClick(param) {
  if (totalPoints > 0 && params[param] < 10) {
      params[param]++;
      totalPoints--;
      updateDisplay();
  }
}

// Функция обработки нажатия кнопки "-"
function handleMinusButtonClick(param) {
  if (params[param] > 0) {
      params[param]--;
      totalPoints++;
      updateDisplay();
  }
}

// Привязка обработчиков событий к кнопкам
document.getElementById('intellect-plus').addEventListener('click', () => handlePlusButtonClick('intellect'));
document.getElementById('intellect-minus').addEventListener('click', () => handleMinusButtonClick('intellect'));
document.getElementById('strength-plus').addEventListener('click', () => handlePlusButtonClick('strength'));
document.getElementById('strength-minus').addEventListener('click', () => handleMinusButtonClick('strength'));
document.getElementById('creativity-plus').addEventListener('click', () => handlePlusButtonClick('creativity'));
document.getElementById('creativity-minus').addEventListener('click', () => handleMinusButtonClick('creativity'));

// Инициализация отображения значений параметров
updateDisplay();
});
