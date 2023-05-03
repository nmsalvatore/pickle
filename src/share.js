export const share = {
    generateWordleEmojis(board) {
        const emojiMapping = {
            correct: '🟩',
            present: '🟨',
            absent: '⬜',
        };
    
        let emojis = "";
    
        for (const rowKey in board) {
            const row = board[rowKey];
            
            if (row.length === 0) {
                return emojis;
            }

            emojis += '\n';
            for (const square of row) {
                switch (square.status) {
                    case "correct":
                    emojis += emojiMapping.correct;
                    break;
                case "present":
                    emojis += emojiMapping.present;
                    break;
                case "absent":
                    emojis += emojiMapping.absent;
                    break;
                }
            }
        }
    
        return emojis;
    }
}