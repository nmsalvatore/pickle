async function fetchAnswerList() {
    try {
        const jsonPath = process.env.WEBPACK_ANSWERS_JSON_PATH;
        console.log(jsonPath)
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
        this.currentNum = Math.floor((Date.now() - epoch) / 86400000);
        this.yesterdayNum = this.currentNum - 1;
        this.answers = await fetchAnswerList();
    },

    getWordle(num) {
        return this.answers[num];
    },

    getYesterday() {
        return this.answers[this.yesterdayNum];
    },

    getWord(num) {
        return this.answers[num];
    },

    getRandom() {
        const random = Math.floor(Math.random() * this.currentNum);
        return this.answers[random];
    },

    getWordNum(word) {
        return this.answers.indexOf(word);
    },

    getYesterdayNum() {
        return this.yesterdayNum;
    }
};

// Call the initialize function
archive.initialize();

export { archive };
