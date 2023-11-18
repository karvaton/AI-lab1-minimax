// Глобальні константи
const X = "X"; // Гравець що грає за "хрестики"
const O = "O"; // Гравець що грає за "нулики"

// Змінні для додавання графічного інтерфейсу
const root = document.getElementById('root');
const board = root.getElementsByClassName('board')[0];
const cells = board.getElementsByClassName('cell');
const message = document.getElementById('message');
const restartButton = document.createElement('button'); // Кнопка "почати заново"
restartButton.setAttribute('id', 'restart');
restartButton.textContent = 'Почати з початку';
restartButton.addEventListener('click', restart);


let user; // змінна в яку присвоюється символ яким грає гравець (людина)
let nextPlayer = X; // змінна наступного гравця
const boardSymbols = initBoard(); // масив даних заповнених клітинок


// функція ініціалізації дошки
function initBoard() {
    return Array(9).fill(null);
}


// вибір сторони (візуальна складова)
const choiceField = document.getElementById('choice');
const choiceButtons = choiceField.getElementsByTagName('button');

Array.from(choiceButtons).forEach((button, index) => {
    button.addEventListener('click', () => {
        setNextPlayer(X);

        if (index === 1) {
            user = O;
            computerMove();
        } else {
            user = X;
        }

        choiceField.remove();
        root.appendChild(restartButton);
    });
});



// функція виконання ходу користувача при клікі на клітинці
Array.from(cells).forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (!cell.textContent && nextPlayer === user) {
            makeMove(index);
        }
    });
});


// функція здійснення ходу
function makeMove(index) {
    setSymbol(index);
    setNextPlayer(nextPlayer === X ? O : X);
    
    const winner = checkWin(boardSymbols);
    if (winner) {
        setTimeout(() => alert(`Переміг "${winner === 1 ? X : O}"`), 10);
        return;
    } else if (winner === 0) {
        setTimeout(() => alert("Нічия"), 10);
        return;
    }

    if (nextPlayer !== user) {
        computerMove();
    }
}


// функція ходу комп'ютера
function computerMove() {
    let index;
    board.classList.add('waiting');
    setTimeout(() => {
        index = findBestMove(nextPlayer, boardSymbols);
        board.classList.remove('waiting');
        makeMove(index);
    }, 500);
}


// функція для додавання символа на дошку 
function setSymbol(index) {
    boardSymbols[index] = nextPlayer;
    cells[index].textContent = nextPlayer;
}


// встановити наступного гравця
function setNextPlayer(player) {
    nextPlayer = player;
    message.textContent = player;
}


// алгоритм пошуку Мінімакс
function minimax(isMax) {
    const result = checkWin(boardSymbols);
    if (result !== null) {
        return result;
    }

    let bestScore = isMax ? -Infinity : Infinity;
    let player = isMax ? X : O;
    
    for (let i = 0; i < boardSymbols.length; i++) {
        if (boardSymbols[i] === null) {
            boardSymbols[i] = player;
            const score = minimax(!isMax);
            boardSymbols[i] = null;
            bestScore = Math[isMax ? 'max' : 'min'](score, bestScore);
        }
    }
    return bestScore;
}


// пошук найкращого ходу комп'ютера
function findBestMove(player, board) {
    let bestScore = player === X ? -Infinity : Infinity;
    let bestMove = -1;
  
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = player;
            const score = minimax(player === O);
            board[i] = null;
  
            if (player === O ? score < bestScore : score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
  
    return bestMove;
}


// функція перевірки поточного стану гри (перемога, нічия)
function checkWin(board) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a] === X ? 1 : -1;
        }
    }

    if (board.includes(null))
        return null;
    return 0;
}


// Функція почати з початку
function restart() {
    boardSymbols.fill(null);
    Array.from(cells).forEach(cell => cell.textContent = '');
    root.appendChild(choiceField);
    restartButton.remove();
}