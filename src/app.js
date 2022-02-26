import wordList from './word_list.json'

export const game = {
    rowNum: 1,
    over: false,
    winningWord: '',
    correctNotFound: {},
    hints: {
        correct: [],
        present: [],
        absent: [],
    },
    board: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
    },
    addLetter(letter, row) {
        this.board[row].push({
            'letter': letter,
            'status': null,
        });
    },
    removeLetter(row) {
        this.board[row].pop();
    },
    incrementRow() {
        this.rowNum++;
    },
    checkForValidWord(word) {
        return wordList.includes(word);
    },
    updateLetterStatus(row) {
        this.board[row].forEach((entry, index) => {
            if (entry.letter == this.winningWord[index]) {
                entry.status = 'correct';
            } else if (this.winningWord.includes(entry.letter) && this.correctNotFound[entry.letter] > 0) {
                entry.status = 'present';
            } else {
                entry.status = 'absent';
            }
        });
    },
    updateHints(row) {
        this.board[row].forEach(entry => {
            if (entry.status == 'correct' & !this.hints.correct.includes(entry.letter)) {
                this.hints.correct.push(entry.letter);
                this.hints.present = this.hints.present.filter(val => val != entry.letter);
            }
            
            else if (entry.status == 'present' && !this.hints.present.includes(entry.letter) && !this.hints.correct.includes(entry.letter)) {
                this.hints.present.push(entry.letter);
            }
            
            else if (entry.status == 'absent' && !this.hints.absent.includes(entry.letter)) {
                this.hints.absent.push(entry.letter);
            }
        });
    },
    setCorrectNotFound(row) {
        for (let letter of this.winningWord) {
            const re = new RegExp(letter, 'g');
            this.correctNotFound[letter] = this.winningWord.match(re).length;
        }

        this.board[row].forEach((entry, index) => {
            if (entry.letter == this.winningWord[index]) {
                this.correctNotFound[entry.letter]--;
            }
        });
    },
    getRowWord(row) {
        let word = '';

        for (let entry of this.board[row]) {
            word += entry.letter;
        }

        return word;
    },
    getBoard() {
        return this.board;
    },
    setWinningWord(word) {
        this.winningWord = word;
    }
}