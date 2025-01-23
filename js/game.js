export class Game {
  constructor() {
    this.word = '';
    this.wordLength = 0;
    this.currentRow = 0;
    this.currentTile = 0;
    this.isGameOver = false;
    this.guesses = Array(6).fill('');
  }

  initialize(word) {
    this.word = word;
    this.wordLength = word.length;
    this.currentRow = 0;
    this.currentTile = 0;
    this.isGameOver = false;
    this.guesses = Array(6).fill('');
  }

  addLetter(letter) {
    if (this.currentTile < this.wordLength && !this.isGameOver) {
      this.guesses[this.currentRow] = this.guesses[this.currentRow] + letter;
      this.currentTile++;
      return true;
    }
    return false;
  }

  removeLetter() {
    if (this.currentTile > 0 && !this.isGameOver) {
      this.guesses[this.currentRow] = this.guesses[this.currentRow].slice(0, -1);
      this.currentTile--;
      return true;
    }
    return false;
  }

  checkGuess() {
    if (this.currentTile === this.wordLength && !this.isGameOver) {
      const guess = this.guesses[this.currentRow];
      const result = new Array(this.wordLength).fill('absent');
      
      // Check for correct letters
      for (let i = 0; i < this.wordLength; i++) {
        if (guess[i] === this.word[i]) {
          result[i] = 'correct';
        }
      }
      
      // Check for present letters
      for (let i = 0; i < this.wordLength; i++) {
        if (result[i] !== 'correct') {
          const targetLetter = guess[i];
          for (let j = 0; j < this.wordLength; j++) {
            if (
              targetLetter === this.word[j] &&
              result[j] !== 'correct' &&
              guess[j] !== this.word[j]
            ) {
              result[i] = 'present';
              break;
            }
          }
        }
      }

      this.currentRow++;
      this.currentTile = 0;
      
      if (guess === this.word) {
        this.isGameOver = true;
      } else if (this.currentRow >= 6) {
        this.isGameOver = true;
      }

      return result;
    }
    return null;
  }
}