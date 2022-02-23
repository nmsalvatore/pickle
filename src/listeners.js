import { game } from './app';
import { view } from './view';
import { archive } from './archive';

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

        if (num + e.key <= archive.getYesterdayNum()) {
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
        startGame(archive.getWord(num));
        num = '';
    }

    if (inGame) {
        listenForKeys(e.code, e.key);
    }
});

document.addEventListener('click', e => {
    const inGame = gameBoard.classList.contains('in-game');

    if (e.target.textContent == "Yesterday's Wordle") {
        startGame(archive.getYesterday());
    }

    if (e.target.textContent == 'Random From Wordle Archive') {
        startGame(archive.getRandom());
    }

    if (e.target.textContent == 'Select From Wordle Archive') {
        view.renderNumInputContainer();
        numInputMax.textContent = archive.getYesterdayNum();
    }

    if (e.target.classList.contains('key') && inGame) {
        listenForKeys(capitalize(e.target.id), e.target.textContent);
    }

    if (e.target.parentNode.id == 'gameHeader') {
        location.reload();
    }

    if (e.target.classList.contains('num-key')) {
        if (num[0] == 0) {
            return;
        }

        if (num + e.target.textContent <= archive.getYesterdayNum()) {
            num += e.target.textContent;
            numInput.textContent = num;
        }
    }

    if (e.target.id == 'numBack') {
        num = num.slice(0,-1);
        numInput.textContent = num;
    }

    if (e.target.id == 'numEnter' && num != '') {
        startGame(archive.getWord(num));
        view.hideNumInputContainer();
        num = '';
    }

    if (e.target.id == 'closePromptBtn') {
        view.hideNumInputContainer();
    }
});

function startGame(word) {
    game.setWinningWord(word);
    view.showBoard();
    view.hideSelectionPrompt();
    view.renderBoard();
}

function listenForKeys(code, key) {
    if (game.over) return;

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

            if (word == game.winningWord || row == 'row6') {
                game.over = true;
            } else {
                game.incrementRow();
            }
        }
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}