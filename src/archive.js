import wordList from './word_list.json';

const epoch = new Date('2021/06/19');
const currentNum = Math.floor((Date.now() - epoch) / 86400000);
const yesterdayNum = currentNum - 1;

export const archive = {
    getWordle(num) {
        return wordList[num];
    },
    getYesterday() {
        return wordList[yesterdayNum];
    },
    getWord(num) {
        return wordList[num];
    },
    getRandom() {
        const random = Math.floor(Math.random() * currentNum)
        return wordList[random];
    },
    getWordNum(word) {
        return wordList.indexOf(word);
    },
    getYesterdayNum() {
        return yesterdayNum;
    }
}