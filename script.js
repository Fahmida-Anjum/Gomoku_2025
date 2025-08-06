const board = document.getElementById('board');
const movesDisplay = document.getElementById('moves');
const turnDisplay = document.getElementById('turn');
const resetButton = document.getElementById('reset-btn');

const SIZE = 10;
let currentPlayer = 'black';
let blackMoves = 0;
let whiteMoves = 0;
let cells = [];

function createBoard() {
    board.innerHTML = '';
    cells = [];

    for (let row = 0; row < SIZE; row++) {
        cells[row] = [];

        for (let col = 0; col < SIZE; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handlePlayerMove);

            board.appendChild(cell);
            cells[row][col] = null;
        }
    }
}

function handlePlayerMove(event) {
    if (currentPlayer !== 'black') return;

    const cell = event.target;
    const row = +cell.dataset.row;
    const col = +cell.dataset.col;

    if (cells[row][col]) return;

    makeMove(row, col, 'black');
    blackMoves++;
    updateInfo();

    if (checkWin(row, col)) {
        setTimeout(() => alert("Black Wins!"), 100);
        return;
    }

    currentPlayer = 'white';
    updateInfo();
    setTimeout(computerMove, 400);
}

function computerMove() {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            if (cells[row][col]) continue;

            cells[row][col] = 'white';
            let aiScore = evaluatePosition(row, col, 'white');
            cells[row][col] = null;

            cells[row][col] = 'black';
            let playerScore = evaluatePosition(row, col, 'black');
            cells[row][col] = null;

            let score = Math.max(aiScore * 1.2, playerScore * 1.5);

            if (score > bestScore) {
                bestScore = score;
                bestMove = [row, col];
            }
        }
    }

    if (bestMove) {
        const [row, col] = bestMove;
        makeMove(row, col, 'white');
        whiteMoves++;
        updateInfo();

        if (checkWin(row, col)) {
            setTimeout(() => alert("White Wins!"), 100);
            return;
        }

        currentPlayer = 'black';
        updateInfo();
    }
}

function evaluatePosition(row, col, player) {
    const directions = [
        [0, 1], [1, 0], [1, 1], [1, -1]
    ];

    let score = 0;

    for (const [dx, dy] of directions) {
        let count = 1;
        count += countInDirection(row, col, dx, dy, player);
        count += countInDirection(row, col, -dx, -dy, player);
        score = Math.max(score, count);
    }

    return score;
}

function countInDirection(row, col, dx, dy, player) {
    let count = 0;
    let r = row + dx;
    let c = col + dy;

    while (
        r >= 0 && r < SIZE &&
        c >= 0 && c < SIZE &&
        cells[r][c] === player
    ) {
        count++;
        r += dx;
        c += dy;
    }

    return count;
}

function makeMove(row, col, player) {
    cells[row][col] = player;
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    const dot = document.createElement('div');
    dot.classList.add('dot', player);
    cell.appendChild(dot);
}

function updateInfo() {
    movesDisplay.textContent = `Black Moves: ${blackMoves} | White Moves: ${whiteMoves}`;
    turnDisplay.textContent = `Current Turn: ${capitalize(currentPlayer)}`;
}

function checkWin(row, col) {
    const directions = [
        [0, 1], [1, 0], [1, 1], [1, -1]
    ];

    for (const [dx, dy] of directions) {
        let winCells = [[row, col]];
        winCells = winCells.concat(getMatches(row, col, dx, dy));
        winCells = winCells.concat(getMatches(row, col, -dx, -dy));

        if (winCells.length >= 5) {
            highlightWinningCells(winCells);
            return true;
        }
    }
    return false;
}

function getMatches(row, col, dx, dy) {
    const matched = [];
    let r = row + dx;
    let c = col + dy;

    while (r >= 0 && r < SIZE && c >= 0 && c < SIZE && cells[r][c] === currentPlayer) {
        matched.push([r, c]);
        r += dx;
        c += dy;
    }

    return matched;
}

function highlightWinningCells(winCells) {
    winCells.forEach(([r, c]) => {
        const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) cell.classList.add('winner');
    });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function resetGame() {
    blackMoves = 0;
    whiteMoves = 0;
    currentPlayer = 'black';
    createBoard();
    updateInfo();
    alert('Game has been Reset!');
}

resetButton.addEventListener('click', resetGame);

createBoard();
updateInfo();
