import { game } from './app';
import { view } from './view';
import { archive } from './archive';
import { share } from './share';
import { countRowsCompleted, copyToClipboard, readFromClipboard } from './utils';

view.hideBoard();
view.renderSelectionPrompt();

let num = '';

document.addEventListener('keydown', e => {
    const gameBoard = document.getElementById('gameBoard');
    const inGame = gameBoard.classList.contains('in-game');

    if (e.key >= 0 && e.key <= 9) {
        if (num[0] == 0) {
            return;
        }

        if (num + e.key <= archive.getYesterdaysWordNumber()) {
            num += e.key;
            numInput.textContent = num;
        }
    }

    if (numInputContainer.classList.contains('flex') && e.key == 'Backspace') {
        num = num.slice(0,-1);
        numInput.textContent = num;
    }

    if (e.key == 'Enter' && num != '') {
        numInputContainer.style.display = 'none';
        startGame(archive.getSelectWord(num));
        num = '';
    }

    if (inGame) {
        listenForKeys(e.code, e.key);
    }
});

document.addEventListener('click', e => {
    const inGame = gameBoard.classList.contains('in-game');

    if (e.target.textContent == "Yesterday's Wordle") {
        startGame(archive.getYesterdaysWord());
    }

    if (e.target.textContent == 'Random From Wordle Archive') {
        startGame(archive.getRandomWord());
    }

    if (e.target.textContent == 'Select From Wordle Archive') {
        view.renderNumInputContainer();
        numInputMax.textContent = archive.getYesterdaysWordNumber();
    }

    if (e.target.classList.contains('key') && inGame) {
        listenForKeys(capitalize(e.target.id), e.target.textContent);
    }

    if (e.target.id == 'gameTitle') {
        location.reload();
    }

    if (e.target.classList.contains('num-key')) {
        if (num[0] == 0) {
            return;
        }

        if (num + e.target.textContent <= archive.getYesterdaysWordNumber()) {
            num += e.target.textContent;
            numInput.textContent = num;
        }
    }

    if (e.target.id == 'numBack') {
        num = num.slice(0,-1);
        numInput.textContent = num;
    }

    if (e.target.id == 'numEnter' && num != '') {
        startGame(archive.getSelectWord(num));
        view.hideNumInputContainer();
        num = '';
    }

    if (e.target.id == 'closePromptBtn') {
        view.hideNumInputContainer();
    }

    if (e.target.id == 'playAgainButton') {
        location.reload();
    }

    const gameOverPrompt = document.getElementById('gameOverPrompt');
    if (!gameOverPrompt.contains(e.target)) {
        const gameOverContainer = document.getElementById('gameOverContainer');
        const gameStatsButton = document.getElementById('gameStats');

        if (gameOverContainer.classList.contains('flex')) {
            gameOverContainer.classList.remove('flex');
            gameOverContainer.classList.add('hidden');
            gameStatsButton.classList.remove('hidden');
        }
    }

    if (e.target.id == 'gameStats') {
        const gameOverContainer = document.getElementById('gameOverContainer');
        const gameStatsButton = document.getElementById('gameStats');

        if (gameOverContainer.classList.contains('hidden')) {
            gameOverContainer.classList.add('flex');
            gameOverContainer.classList.remove('hidden');
            gameStatsButton.classList.add('hidden');
        }
    }

    if (e.target.id == 'shareButton') {
        const button = e.target;
        const board = game.board;
        const emojis = share.generateWordleEmojis(board);
        const num = archive.getWordNumber(game.winningWord);
        const rowsCompleted = countRowsCompleted(board);
        const answer = 'Wordle ' + num + ' ' + rowsCompleted + '/6\n' + emojis;
        copyToClipboard(answer);
    }
});

function startGame(word) {
    game.setWinningWord(word);
    view.showBoard();
    view.hideSelectionPrompt();
    view.renderBoard();
    view.renderWordleNumber(word);
}

function listenForKeys(code, key) {
    if (game.over) {
        return;
    }

    const isKey = code.slice(0,3) == 'Key';
    const row = `row${game.rowNum}`;
    const rowLength = game.board[row].length;

    if (isKey && rowLength < 5) {
        game.addLetter(key, row);
        view.updateBoard();
    }

    if (code == 'Backspace' && rowLength > 0) {
        game.removeLetter(row);
        view.updateBoard();
    }

    if (code == 'Enter' && rowLength == 5) {
        const word = game.getRowWord(row);
        const isWord = game.checkForValidWord(word);

        if (isWord) {
            game.setCorrectNotFound(row);
            game.updateLetterStatus(row);
            game.updateHints(row);
            view.renderKeyHints();
            view.updateBoard();

            if (word == game.winningWord) {
                game.over = true;
                setTimeout(() => {
                    view.renderGameOverPrompt();
                }, 1000)
            } else if (row == 'row6') {
                game.over = true;
                setTimeout(() => {
                    view.renderGameOverPrompt(game.winningWord)
                }, 500)
            } else {
                game.incrementRow();
            }
        }
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}