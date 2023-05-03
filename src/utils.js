export function countRowsCompleted(board) {
    let count = 0;

    for (const key in board) {
        const row = board[key];
        if (row.length != 0) {
            count++;
        }
    }

    return count;
}

export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.log('Text copied to clipboard:', text);
    } catch (err) {
        console.error('Failed to copy text:', err);
    }
}
  