document.addEventListener('DOMContentLoaded', function() {
    // Общее количество баллов
let totalPoints = eatenFoodCount

// Значения параметров
let params = {
  intellect: 0,
  strength: 0,
  creativity: 0
};

// Функция обновления отображения значений параметров
function updateDisplay() {
  document.getElementById('points').textContent = totalPoints;
  document.getElementById('intellect').textContent = params.intellect;
  document.getElementById('creativity').textContent = params.creativity;
  document.getElementById('strength').textContent = params.strength;

  // Проверяем, все ли баллы распределены
  if (totalPoints === 0) {
      document.getElementById('next-button').style.display = 'block';
  } else {
      document.getElementById('next-button').style.display = 'none';
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