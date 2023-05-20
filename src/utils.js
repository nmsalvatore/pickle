export function countRowsCompleted(board) {
    let count = 0;

    for (const key in board) {
        const row = board[key];

        if (row.length != 0) {
            count++;
        }

        if (key == 'row6' && row.length != 0) {
            const lossOnLastLine = checkForLossOnLastLine(board);
            if (lossOnLastLine) {
                return 'X';
            }
        }
    }

    return count;
}

export async function copyToClipboard(text) {
    const button = document.getElementById('shareButton');
    try {
        await navigator.clipboard.writeText(text);
        button.textContent = '\u2713 Copied!';
        button.classList.add('copied');
    } catch (err) {
        console.error('Failed to copy text:', err);
        button.textContent = 'Copy Failed.';
        button.classList.add('failed');
    }
}

export async function readFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        console.log(text)
    } catch (err) {
        console.error('Failed to read clipboard contents:', err);
    }
}

function checkForLossOnLastLine(board) {
    const lastLineStatuses = board.row6.map(square => square.status)
    const statusSet = new Set(lastLineStatuses);
    const statusArray = Array.from(statusSet);
    const winCondition = statusArray[0] == 'correct' && statusArray.length == 1;
    const isLoss = !winCondition;
    return isLoss;
}