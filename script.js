
// script.js

// Game State
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'player'; // 'player' or 'ai'
let scores = { X: 0, O: 0, draw: 0 };

// Winning combinations
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// DOM Elements
const cells = document.querySelectorAll('.cell');
const gameInfo = document.getElementById('gameInfo');
const resetBtn = document.getElementById('resetBtn');
const modeBtns = document.querySelectorAll('.mode-btn');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const scoreDraw = document.getElementById('scoreDraw');

// Initialize game
function init() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetBtn.addEventListener('click', resetGame);

    modeBtns.forEach(btn => {
        btn.addEventListener('click', handleModeChange);
    });

    updateScoreBoard();
}

// Handle cell click
function handleCellClick(e) {
    const index = e.target.dataset.index;

    if (board[index] !== '' || !gameActive) {
        return;
    }

    makeMove(index, currentPlayer);

    if (gameActive && gameMode === 'ai' && currentPlayer === 'O') {
        setTimeout(aiMove, 500);
    }
}

// Make a move
function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add('taken', player.toLowerCase());

    if (checkWin(player)) {
        gameActive = false;
        highlightWinningCells(player);
        gameInfo.textContent = `Player ${player} Wins! 🎉`;
        scores[player]++;
        updateScoreBoard();
    } else if (checkDraw()) {
        gameActive = false;
        gameInfo.textContent = "It's a Draw! 🤝";
        scores.draw++;
        updateScoreBoard();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        gameInfo.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

// Check for win
function checkWin(player) {
    return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === player);
    });
}

// Check for draw
function checkDraw() {
    return board.every(cell => cell !== '');
}

// Highlight winning cells
function highlightWinningCells(player) {
    winPatterns.forEach(pattern => {
        if (pattern.every(index => board[index] === player)) {
            pattern.forEach(index => {
                cells[index].classList.add('winner');
            });
        }
    });
}

// AI Move (Simple random strategy with some smart moves)
function aiMove() {
    if (!gameActive) return;

    // Try to win
    let move = findWinningMove('O');

    // Block opponent from winning
    if (move === -1) {
        move = findWinningMove('X');
    }

    // Take center if available
    if (move === -1 && board[4] === '') {
        move = 4;
    }

    // Take a corner
    if (move === -1) {
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => board[i] === '');
        if (availableCorners.length > 0) {
            move = availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
    }

    // Take any available space
    if (move === -1) {
        const availableCells = board.map((cell, index) => cell === '' ? index : null).filter(i => i !== null);
        move = availableCells[Math.floor(Math.random() * availableCells.length)];
    }

    if (move !== -1) {
        makeMove(move, 'O');
    }
}

// Find winning move for a player
function findWinningMove(player) {
    for (let pattern of winPatterns) {
        const values = pattern.map(i => board[i]);
        const playerCount = values.filter(v => v === player).length;
        const emptyCount = values.filter(v => v === '').length;

        if (playerCount === 2 && emptyCount === 1) {
            return pattern.find(i => board[i] === '');
        }
    }
    return -1;
}

// Reset game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    gameInfo.textContent = "Player X's Turn";

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'x', 'o', 'winner');
    });
}

// Handle mode change
function handleModeChange(e) {
    modeBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    gameMode = e.target.dataset.mode;

    // Reset scores when changing mode
    scores = { X: 0, O: 0, draw: 0 };
    updateScoreBoard();
    resetGame();

    if (gameMode === 'ai') {
        gameInfo.textContent = "Player X's Turn (You vs AI)";
    }
}

// Update score board
function updateScoreBoard() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    scoreDraw.textContent = scores.draw;
}

// Start the game
init();
