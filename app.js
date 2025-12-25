let board = ["", "", "", "", "", "", "", "", ""];
const player = "O";
const computer = "X";
let gameMode = 1; // 1 = Single Player, 2 = Two Player
let currentPlayer = "O"; 
let totalGames = 0;
let xWins = 0;
let oWins = 0;
let draws = 0;

function setMode(mode) {
    gameMode = mode;
    resetGame();
    document.getElementById('status').innerText = 
        mode === 1 ? "Single Player (Your Turn)" : "Two Player (O's Turn)";
}

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', () => makeMove(cell.getAttribute('data-index')));
});

function makeMove(index) {
    if (board[index] === "" && !checkWinner(board)) {
        if (gameMode === 1) {
            board[index] = player;
            updateUI();
            if (!checkWinner(board)) {
                setTimeout(computerMove, 500);
            }
        } else {
            board[index] = currentPlayer;
            updateUI();
            if (!checkWinner(board)) {
                currentPlayer = (currentPlayer === "O") ? "X" : "O";
                document.getElementById('status').innerText = `${currentPlayer}'s Turn`;
            }
        }
    }
}

function computerMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = computer;
            let score = minimax(board, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    if (move !== undefined) {
        board[move] = computer;
        updateUI();
        checkWinner(board);
    }
}

function updateUI() {
    board.forEach((mark, index) => {
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.innerText = mark;
        if (mark !== "") {
            cell.style.color = mark === "O" ? "#3498db" : "#e74c3c";
        }
    });
}

// Updated checking system for wins and draws
function checkWinner(board) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            let winner = board[a];
            document.getElementById('status').innerText = `${winner} Wins!`;
            
            // Increment Stats
            totalGames++;
            if (winner === "X") xWins++;
            else oWins++;
            
            updateScoreboard();
            return winner;
        }
    }

    if (board.every(cell => cell !== "")) {
        document.getElementById('status').innerText = "It's a Draw!";
        totalGames++;
        draws++;
        updateScoreboard();
        return "tie";
    }
    return null;
}

// Helper to update the HTML display
function updateScoreboard() {
    document.getElementById('total-games').innerText = totalGames;
    document.getElementById('x-wins').innerText = xWins;
    document.getElementById('o-wins').innerText = oWins;
    document.getElementById('draws').innerText = draws;
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "O";
    if (gameMode === 1) {
        document.getElementById('status').innerText = "Your Turn (O)";
    } else {
        document.getElementById('status').innerText = "O's Turn";
    }
    updateUI();
}

function minimax(board, isMaximizing) {
    let result = checkWinnerSilent(board); // Use a silent check for the algorithm
    if (result === computer) return 10;
    if (result === player) return -10;
    if (board.every(cell => cell !== "")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = computer;
                bestScore = Math.max(bestScore, minimax(board, false));
                board[i] = "";
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = player;
                bestScore = Math.min(bestScore, minimax(board, true));
                board[i] = "";
            }
        }
        return bestScore;
    }
}

// Silent version of checkWinner for the AI to calculate moves without affecting stats
function checkWinnerSilent(board) {
    const winConditions = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return null;
}