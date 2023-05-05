async function fetchAnswerList() {
    try {
        const jsonPath = process.env.WEBPACK_ANSWERS_JSON_PATH;
        const response = await fetch(jsonPath);
        const data = await response.json();
        return data.answers;
    } catch (err) {
        console.error('Failed to fetch word list:', err);
    }
}

const archive = {
    answers: [],
    currentNum: 0,
    yesterdayNum: 0,

    async initialize() {
        const epoch = new Date('2021-6-19');
        this.currentWordNumber = Math.floor((Date.now() - epoch) / 86400000);
        this.yesterdaysWordNumber = this.currentWordNumber - 1;
        this.answers = await fetchAnswerList();
    },

    getYesterdaysWord() {
        const number = this.yesterdaysWordNumber;
        const answer = this.answers.find(answer => answer.number == number);
        return answer.word;
    },

    getSelectWord(number) {
        const answer = this.answers.find(answer => answer.number == number);
        return answer.word;
    },

    getRandomWord() {
        const number = Math.floor(Math.random() * this.currentWordNumber);
        const answer = this.answers.find(answer => answer.number == number);
        return answer.word;
    },

    getWordNumber(word) {
        const answer = this.answers.find(answer => answer.word == word);
        return answer.number;
    },

    getYesterdaysWordNumber() {
        return this.yesterdaysWordNumber;
    }
};

// Call the initialize function
archive.initialize();

export { archive };
