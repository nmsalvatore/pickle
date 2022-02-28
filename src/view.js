import { game } from './app';
import { archive } from './archive';

export const view = {
    renderBoard() {
        gameBoard.classList.add('in-game');

        for (let i = 1; i < 31; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            gameBoard.appendChild(square);
        }
    },
    renderNumInputContainer() {
        numInputMax.textContent = archive.getYesterdayNum();
        numInputContainer.classList.add('flex');
        numInputContainer.classList.remove('hidden');
    },
    renderKeyHints() {
        const keys = document.querySelectorAll('.key');

        keys.forEach(key => {
            const letter = key.textContent;
            
            if (game.hints.correct.includes(letter)) {
                key.classList.add('correct');
                key.classList.remove('present');
            }

            else if (game.hints.present.includes(letter)) {
                key.classList.add('present');
            }

            else if (game.hints.absent.includes(letter)) {
                key.classList.add('absent');
            }
        });
    },
    showBoard() {
        gameBoard.classList.add('grid');
        gameBoard.classList.remove('hidden');
    },
    updateBoard() {
        const gameBoardSquares = document.querySelectorAll('.square');

        gameBoardSquares.forEach((square, index) => {
            const rowNum = Math.ceil((index+0.1)/5);
            const row = rowNum;
            const rowPos = index % 5;
            const board = game.getBoard()
            const entry = board[row][rowPos];

            if (entry != undefined) {
                square.textContent = entry.letter.toUpperCase();
                square.classList.add('occupied');

                switch (entry.status) {
                    case 'correct':
                        square.classList.add('correct');
                        square.classList.remove('occupied')
                        break;
                    case 'present':
                        square.classList.add('present');
                        square.classList.remove('occupied')
                        break;
                    case 'absent':
                        square.classList.add('absent');
                        square.classList.remove('occupied')
                        break;
                }
            } else {
                square.textContent = '';
                square.classList.remove('occupied');
            }
        });
    },
    hideBoard() {
        gameBoard.classList.add('hidden');
        gameBoard.classList.remove('grid');
    },
    hideSelectionPrompt() {
        selectionPrompt.classList.add('hidden');
    },
    hideNumInputContainer() {
        numInputContainer.classList.add('hidden');
        numInputContainer.classList.remove('flex');
    },
}