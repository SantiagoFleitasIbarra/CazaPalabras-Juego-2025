import { getRandomWord, getRandomWordLength } from './words.js';
import { Game } from './game.js';

const game = new Game();
const gameBoard = document.getElementById('game-board');
const keyboard = document.getElementById('keyboard');
const messageElement = document.getElementById('message');
const themeToggle = document.getElementById('theme-toggle');

function initializeBoard(wordLength) {
  gameBoard.innerHTML = '';
  document.documentElement.style.setProperty('--word-length', wordLength);
  
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let j = 0; j < wordLength; j++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      row.appendChild(tile);
    }
    gameBoard.appendChild(row);
  }
}

function initializeKeyboard() {
  const layout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
  ];

  keyboard.innerHTML = '';
  layout.forEach(row => {
    const keyboardRow = document.createElement('div');
    keyboardRow.className = 'keyboard-row';
    
    row.forEach(key => {
      const button = document.createElement('button');
      button.className = 'key';
      button.textContent = key;
      button.setAttribute('data-key', key);
      button.addEventListener('click', () => handleInput(key));
      keyboardRow.appendChild(button);
    });
    
    keyboard.appendChild(keyboardRow);
  });
}

function updateBoard() {
  const rows = gameBoard.getElementsByClassName('row');
  for (let i = 0; i < game.guesses.length; i++) {
    const tiles = rows[i].getElementsByClassName('tile');
    const guess = game.guesses[i];
    
    for (let j = 0; j < game.wordLength; j++) {
      tiles[j].textContent = guess[j] || '';
    }
  }
}

function showMessage(text, isError = false) {
  messageElement.textContent = text;
  messageElement.className = `message show ${isError ? 'error' : 'success'}`;
  setTimeout(() => {
    messageElement.className = 'message';
  }, 3000);
}

function animateRow(row, result) {
  const tiles = row.getElementsByClassName('tile');
  for (let i = 0; i < tiles.length; i++) {
    setTimeout(() => {
      tiles[i].className = `tile ${result[i]}`;
      tiles[i].classList.add('pop');
    }, i * 100);
  }
}

function updateKeyboard(result) {
  const guess = game.guesses[game.currentRow - 1];
  for (let i = 0; i < game.wordLength; i++) {
    const key = document.querySelector(`[data-key="${guess[i].toUpperCase()}"]`);
    if (key) {
      const currentClass = key.className.split(' ')[1];
      if (!currentClass || result[i] === 'correct' || 
         (result[i] === 'present' && currentClass !== 'correct') ||
         (result[i] === 'absent' && !currentClass)) {
        key.className = `key ${result[i]}`;
      }
    }
  }
}

function showGameEndModal(isWin) {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  const title = document.createElement('h2');
  title.textContent = isWin ? '¡Felicitaciones!' : 'Game Over';
  
  const message = document.createElement('p');
  message.textContent = isWin 
    ? '¡Has adivinado la palabra correctamente!'
    : `La palabra era: ${game.word}`;
  
  const playAgainBtn = document.createElement('button');
  playAgainBtn.className = 'play-again-btn';
  playAgainBtn.textContent = 'Jugar de nuevo';
  playAgainBtn.addEventListener('click', () => {
    document.body.removeChild(modalOverlay);
    startNewGame();
  });
  
  modal.appendChild(title);
  modal.appendChild(message);
  modal.appendChild(playAgainBtn);
  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);
  
  setTimeout(() => {
    modalOverlay.classList.add('modal-show');
  }, 500);
}

function handleInput(key) {
  if (game.isGameOver) return;

  if (key === '⌫') {
    if (game.removeLetter()) {
      updateBoard();
    }
  } else if (key === 'ENTER') {
    if (game.currentTile === game.wordLength) {
      const result = game.checkGuess();
      if (result) {
        const currentRow = gameBoard.getElementsByClassName('row')[game.currentRow - 1];
        animateRow(currentRow, result);
        updateKeyboard(result);
        
        if (game.isGameOver) {
          const isWin = game.guesses[game.currentRow - 1] === game.word;
          showGameEndModal(isWin);
        }
      }
    }
  } else if (key.length === 1) {
    if (game.addLetter(key.toLowerCase())) {
      updateBoard();
    }
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show';
  
  setTimeout(() => {
    toast.className = 'toast hide';
  }, 3000);
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  themeToggle.innerHTML = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  showToast('Para una agradable vista :)');
}

function handleKeydown(e) {
  const key = e.key.toUpperCase();
  if (key === 'BACKSPACE') {
    handleInput('⌫');
  } else if (key === 'ENTER') {
    handleInput('ENTER');
  } else if (/^[A-ZÑ]$/.test(key)) {
    handleInput(key);
  }
}

function startNewGame() {
  const wordLength = getRandomWordLength();
  const word = getRandomWord(wordLength);
  game.initialize(word);
  initializeBoard(wordLength);
  initializeKeyboard();
  updateBoard();
}

function showHelpModal() {
  const helpModal = document.getElementById('help-modal');
  helpModal.classList.add('modal-show');
}

function closeHelpModal() {
  const helpModal = document.getElementById('help-modal');
  helpModal.classList.remove('modal-show');
}

// Initialize game
document.addEventListener('keydown', handleKeydown);
initializeKeyboard();
themeToggle.addEventListener('click', toggleTheme);
document.getElementById('help-button').addEventListener('click', showHelpModal);
document.querySelector('.close-help-btn').addEventListener('click', closeHelpModal);

// Set initial theme
if (localStorage.getItem('theme') === 'dark' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark-theme');
  themeToggle.innerHTML = '☀️';
}

startNewGame();