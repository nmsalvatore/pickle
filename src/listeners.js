import { game } from './app';
import { view } from './view';
import { archive } from './archive';

listenForMenuBtn();
listenForNumPadEvents();

// listen for keyboard if game has started
document.addEventListener('keydown', e => {
    const inGame = gameBoard.classList.contains('in-game');
    !inGame || listenForKeys(e.code, e.key)
});

document.addEventListener('click', e => {
    const inGame = gameBoard.classList.contains('in-game');
    if (e.target.classList.contains('key') && inGame) {
        listenForKeys(capitalize(e.target.id), e.target.textContent);
    }
});

document.addEventListener('click', e => {
    if (e.target.parentNode.id == 'gameHeader') {
        location.reload();
    }
});

closeBtn.addEventListener('click', view.hideNumInputContainer)

// listener function for number pad events
function listenForNumPadEvents() {
    let num = '';

    // listen for keydown events on number pad
    document.addEventListener('keydown', e => {
        const numPadOpen = numInputContainer.classList.contains('flex');

        if (numPadOpen) {
            const isOldWordleNum = key => num + key <= archive.getYesterdayNum();
        
            if (isOldWordleNum(e.key) && num[0] != 0) {
                num += e.key;
                numInput.textContent = num;
            } else if (e.key == 'Backspace') {
                num = num.slice(0,-1);
                numInput.textContent = num;
            } else if (e.key == 'Enter' && num != '') {
                numInputContainer.style.display = 'none';
                startGame(archive.getWord(num));
                num = '';
            }
        }
    });

    // listen for click events on number pad
    document.addEventListener('click', e => {
        const numPadOpen = numInputContainer.classList.contains('flex');

        if (numPadOpen) {
            const isOldWordleNum = key => num + key <= archive.getYesterdayNum();
            const keyVal = e.target.textContent;
            const key = keyVal == '' || isNaN(keyVal) ? e.target : keyVal;

            if (isOldWordleNum(key) && num[0] != 0) {
                num += key;
                numInput.textContent = num;
            } else {
                try {
                    if (key.classList.contains('backspace')) {
                        console.log('backspace')
                        num = num.slice(0,-1);
                        numInput.textContent = num;
                    } else if (key.classList.contains('enter') && num != '') {
                        numInputContainer.style.display = 'none';
                        startGame(archive.getWord(num));
                        num = '';
                    }
                } catch {
                    return;
                }
            } 
        }
    });
}

function startGame(word) {
    game.setWinningWord(word);
    view.showBoard();
    view.hideSelectionPrompt();
    view.renderBoard();
}

function listenForKeys(code, key) {
    if (game.over) return;

    const isKey = code.slice(0,3) == 'Key';
    const row = game.rowNum;
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
        submitWord(row);
        view.updateBoard();
    }
}

function submitWord(row) {
    const word = game.getRowWord(row);
    const isWord = game.checkForValidWord(word);

    if (isWord) {
        game.setCorrectNotFound(row);
        game.updateLetterStatus(row);
        game.updateHints(row);
        view.renderKeyHints();
        checkForEndgame(word, row);
    }
}

function checkForEndgame(word, row) {
    const endCondition = word == game.winningWord || row == 6;
    return endCondition ? game.over = true : game.incrementRow();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// listener function for click on main menu buttons
function listenForMenuBtn() {
    yesterdayBtn.addEventListener('click', () => {
        const word = archive.getYesterday();
        startGame(word);
    });

    randomBtn.addEventListener('click', () => {
        const word = archive.getRandom();
        startGame(word);
    });

    selectBtn.addEventListener('click', view.renderNumInputContainer);
}