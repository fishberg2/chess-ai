// --- Initial Board Setup ---
function getInitialBoardSetup() {
  return [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'], // Black pieces
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], // Black pawns
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // White pawns
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']  // White pieces
  ];
}

let initialBoardState = getInitialBoardSetup();

// Unicode characters for chess pieces
const pieceUnicode = {
    'r': '\u265C', 'n': '\u265E', 'b': '\u265D', 'q': '\u265B', 'k': '\u265A', 'p': '\u265F',
    'R': '\u2656', 'N': '\u2658', 'B': '\u2657', 'Q': '\u2655', 'K': '\u2654', 'P': '\u2659'
};

let selectedPiece = null; // { row: r, col: c }
let currentPlayer = 'white'; // 'white' or 'black'
let gameOver = false;

// --- Board Utilities ---
function deepCopyBoard(board) {
  return board.map(arr => arr.slice());
}

// --- Piece Helper Functions ---
function getPieceAt(board, row, col) {
    if (row < 0 || row >= 8 || col < 0 || col >= 8) return undefined; 
    return board[row][col];
}

function getPieceColor(pieceChar) {
    if (!pieceChar) return null;
    if (pieceChar === pieceChar.toUpperCase()) return 'white';
    if (pieceChar === pieceChar.toLowerCase()) return 'black';
    return null;
}

function getPieceType(pieceChar) {
    if (!pieceChar) return null;
    const lowerCasePiece = pieceChar.toLowerCase();
    switch (lowerCasePiece) {
        case 'p': return 'Pawn';
        case 'r': return 'Rook';
        case 'n': return 'Knight';
        case 'b': return 'Bishop';
        case 'q': return 'Queen';
        case 'k': return 'King';
        default: return null;
    }
}

// --- Generic Move Validation Helpers ---
function isTargetSquareValid(board, toRow, toCol, pieceColor) {
    const targetPiece = getPieceAt(board, toRow, toCol);
    if (targetPiece && getPieceColor(targetPiece) === pieceColor) {
        return false; 
    }
    return true; 
}

// --- Piece Move Validation Functions ---
function isValidPawnMove(board, fromRow, fromCol, toRow, toCol, pieceColor) {
    if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) return false;
    if (!isTargetSquareValid(board, toRow, toCol, pieceColor)) return false;

    const pieceChar = getPieceAt(board, fromRow, fromCol);
    const actualPieceColor = getPieceColor(pieceChar); 

    const targetPiece = getPieceAt(board, toRow, toCol);
    const direction = (actualPieceColor === 'white') ? -1 : 1;

    if (toCol === fromCol && toRow === fromRow + direction && !targetPiece) return true;
    const startingRow = (actualPieceColor === 'white') ? 6 : 1;
    if (fromRow === startingRow && toCol === fromCol && toRow === fromRow + 2 * direction && !targetPiece && !getPieceAt(board, fromRow + direction, fromCol)) return true;
    if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow + direction && targetPiece) return true;
    return false;
}

function isValidKnightMove(board, fromRow, fromCol, toRow, toCol, pieceColor) {
    if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) return false;
    if (!isTargetSquareValid(board, toRow, toCol, pieceColor)) return false;
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

function isValidKingMove(board, fromRow, fromCol, toRow, toCol, pieceColor) {
    if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) return false;
    if (!isTargetSquareValid(board, toRow, toCol, pieceColor)) return false;
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0);
}

function isValidRookMove(board, fromRow, fromCol, toRow, toCol, pieceColor) {
    if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) return false;
    if (!isTargetSquareValid(board, toRow, toCol, pieceColor)) return false;
    if (fromRow !== toRow && fromCol !== toCol) return false; 

    if (fromRow === toRow) { 
        const step = (toCol > fromCol) ? 1 : -1;
        for (let c = fromCol + step; c !== toCol; c += step) {
            if (getPieceAt(board, fromRow, c)) return false; 
        }
    } else { 
        const step = (toRow > fromRow) ? 1 : -1;
        for (let r = fromRow + step; r !== toRow; r += step) {
            if (getPieceAt(board, r, fromCol)) return false; 
        }
    }
    return true;
}

function isValidBishopMove(board, fromRow, fromCol, toRow, toCol, pieceColor) {
    if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) return false;
    if (!isTargetSquareValid(board, toRow, toCol, pieceColor)) return false;
    if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) return false; 

    const rowStep = (toRow > fromRow) ? 1 : -1;
    const colStep = (toCol > fromCol) ? 1 : -1;
    let r = fromRow + rowStep;
    let c = fromCol + colStep;
    while (r !== toRow) {
        if (getPieceAt(board, r, c)) return false; 
        r += rowStep;
        c += colStep;
    }
    return true;
}

function isValidQueenMove(board, fromRow, fromCol, toRow, toCol, pieceColor) {
    return isValidRookMove(board, fromRow, fromCol, toRow, toCol, pieceColor) ||
           isValidBishopMove(board, fromRow, fromCol, toRow, toCol, pieceColor);
}

// --- Check Detection ---
function isKingInCheck(kingColor, board) {
    let kingRow, kingCol;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = getPieceAt(board, r, c);
            if (piece && getPieceColor(piece) === kingColor && getPieceType(piece) === 'King') {
                kingRow = r; kingCol = c; break;
            }
        }
        if (kingRow !== undefined) break;
    }
    if (kingRow === undefined) return false; 

    const opponentColor = (kingColor === 'white') ? 'black' : 'white';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = getPieceAt(board, r, c);
            if (piece && getPieceColor(piece) === opponentColor) {
                const pieceType = getPieceType(piece);
                let canAttack = false;
                switch (pieceType) {
                    case 'Pawn':   canAttack = isValidPawnMove(board, r, c, kingRow, kingCol, opponentColor); break;
                    case 'Knight': canAttack = isValidKnightMove(board, r, c, kingRow, kingCol, opponentColor); break;
                    case 'Bishop': canAttack = isValidBishopMove(board, r, c, kingRow, kingCol, opponentColor); break;
                    case 'Rook':   canAttack = isValidRookMove(board, r, c, kingRow, kingCol, opponentColor); break;
                    case 'Queen':  canAttack = isValidQueenMove(board, r, c, kingRow, kingCol, opponentColor); break;
                    case 'King':   canAttack = isValidKingMove(board, r, c, kingRow, kingCol, opponentColor); break; 
                }
                if (canAttack) return true;
            }
        }
    }
    return false;
}

function isMovePuttingKingInCheck(fromRow, fromCol, toRow, toCol, pieceColor, currentBoard) {
    const tempBoard = deepCopyBoard(currentBoard);
    const pieceToMove = getPieceAt(tempBoard, fromRow, fromCol);
    tempBoard[toRow][toCol] = pieceToMove;
    tempBoard[fromRow][fromCol] = null;
    return isKingInCheck(pieceColor, tempBoard);
}

// --- Legal Moves Generation ---
function getAllPotentialMovesForPiece(board, fromRow, fromCol) {
    const pieceChar = getPieceAt(board, fromRow, fromCol);
    if (!pieceChar) return [];
    const pieceType = getPieceType(pieceChar);
    const pieceColor = getPieceColor(pieceChar);
    let potentialMoves = [];

    switch (pieceType) {
        case 'Pawn':
            const direction = (pieceColor === 'white') ? -1 : 1;
            potentialMoves.push({ r: fromRow + direction, c: fromCol }); 
            if ((pieceColor === 'white' && fromRow === 6) || (pieceColor === 'black' && fromRow === 1)) {
                potentialMoves.push({ r: fromRow + 2 * direction, c: fromCol }); 
            }
            potentialMoves.push({ r: fromRow + direction, c: fromCol - 1 }); 
            potentialMoves.push({ r: fromRow + direction, c: fromCol + 1 }); 
            break;
        case 'Knight':
            const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
            knightMoves.forEach(move => potentialMoves.push({ r: fromRow + move[0], c: fromCol + move[1] }));
            break;
        case 'King':
            const kingMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
            kingMoves.forEach(move => potentialMoves.push({ r: fromRow + move[0], c: fromCol + move[1] }));
            break;
        case 'Rook': case 'Bishop': case 'Queen':
            const directions = {
                'Rook': [[-1, 0], [1, 0], [0, -1], [0, 1]],
                'Bishop': [[-1, -1], [-1, 1], [1, -1], [1, 1]],
                'Queen': [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]
            };
            directions[pieceType].forEach(dir => {
                for (let i = 1; i < 8; i++) {
                    potentialMoves.push({ r: fromRow + dir[0] * i, c: fromCol + dir[1] * i });
                }
            });
            break;
    }
    return potentialMoves.filter(move => move.r >= 0 && move.r < 8 && move.c >= 0 && move.c < 8);
}

function hasLegalMoves(playerColor, board) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const pieceChar = getPieceAt(board, r, c);
            if (pieceChar && getPieceColor(pieceChar) === playerColor) {
                const pieceType = getPieceType(pieceChar);
                const potentialMoves = getAllPotentialMovesForPiece(board, r, c);
                for (const move of potentialMoves) {
                    let isValidSpecificMove = false;
                    switch (pieceType) {
                        case 'Pawn':   isValidSpecificMove = isValidPawnMove(board, r, c, move.r, move.c, playerColor); break;
                        case 'Knight': isValidSpecificMove = isValidKnightMove(board, r, c, move.r, move.c, playerColor); break;
                        case 'Bishop': isValidSpecificMove = isValidBishopMove(board, r, c, move.r, move.c, playerColor); break;
                        case 'Rook':   isValidSpecificMove = isValidRookMove(board, r, c, move.r, move.c, playerColor); break;
                        case 'Queen':  isValidSpecificMove = isValidQueenMove(board, r, c, move.r, move.c, playerColor); break;
                        case 'King':   isValidSpecificMove = isValidKingMove(board, r, c, move.r, move.c, playerColor); break;
                    }
                    if (isValidSpecificMove && !isMovePuttingKingInCheck(r, c, move.r, move.c, playerColor, board)) {
                        return true; 
                    }
                }
            }
        }
    }
    return false; 
}

// --- Pawn Promotion ---
function handlePawnPromotion(pieceColor) {
    let choice = '';
    const validChoices = ['Q', 'R', 'B', 'N'];
    while (true) {
        choice = prompt("Promote pawn to (Q, R, B, N):", "Q");
        if (choice === null) { 
            choice = "Q"; 
            break;
        }
        choice = choice.toUpperCase();
        if (validChoices.includes(choice)) {
            break;
        }
        alert("Invalid choice. Please enter Q, R, B, or N.");
    }

    if (pieceColor === 'white') {
        return choice; 
    } else {
        return choice.toLowerCase(); 
    }
}

// --- Game Reset ---
function resetGame() {
    initialBoardState = getInitialBoardSetup();
    currentPlayer = 'white';
    gameOver = false;
    selectedPiece = null;
    renderBoard();
    console.log("Game has been reset.");
    // Clear any HTML status messages here if they exist
}

function renderBoard() {
    const table = document.querySelector('table');
    if (!table) return;
    for (let i = 0; i < initialBoardState.length; i++) {
        const row = table.rows[i];
        if (!row) continue;
        for (let j = 0; j < initialBoardState[i].length; j++) {
            const cell = row.cells[j];
            if (!cell) continue;
            const piece = getPieceAt(initialBoardState, i, j);
            cell.textContent = (piece && pieceUnicode[piece]) ? pieceUnicode[piece] : '';
            if (selectedPiece && selectedPiece.row === i && selectedPiece.col === j) {
                cell.classList.add('selected');
            } else {
                cell.classList.remove('selected');
            }
        }
    }
}

function handleCellClick(row, col) {
    if (gameOver) {
        console.log("Game is over. No more moves allowed.");
        return;
    }

    const clickedPieceChar = getPieceAt(initialBoardState, row, col); 
    const clickedPieceColor = getPieceColor(clickedPieceChar);

    if (selectedPiece) {
        const pieceToMoveOriginal = getPieceAt(initialBoardState, selectedPiece.row, selectedPiece.col);
        const pieceToMoveColor = getPieceColor(pieceToMoveOriginal);
        const pieceToMoveType = getPieceType(pieceToMoveOriginal);

        if (selectedPiece.row === row && selectedPiece.col === col) {
            selectedPiece = null; 
        } else {
            let isValidBasicMove = false;
            switch (pieceToMoveType) {
                case 'Pawn':   isValidBasicMove = isValidPawnMove(initialBoardState, selectedPiece.row, selectedPiece.col, row, col, pieceToMoveColor); break;
                case 'Knight': isValidBasicMove = isValidKnightMove(initialBoardState, selectedPiece.row, selectedPiece.col, row, col, pieceToMoveColor); break;
                case 'King':   isValidBasicMove = isValidKingMove(initialBoardState, selectedPiece.row, selectedPiece.col, row, col, pieceToMoveColor); break;
                case 'Rook':   isValidBasicMove = isValidRookMove(initialBoardState, selectedPiece.row, selectedPiece.col, row, col, pieceToMoveColor); break;
                case 'Bishop': isValidBasicMove = isValidBishopMove(initialBoardState, selectedPiece.row, selectedPiece.col, row, col, pieceToMoveColor); break;
                case 'Queen':  isValidBasicMove = isValidQueenMove(initialBoardState, selectedPiece.row, selectedPiece.col, row, col, pieceToMoveColor); break;
            }

            if (isValidBasicMove) {
                if (isMovePuttingKingInCheck(selectedPiece.row, selectedPiece.col, row, col, currentPlayer, initialBoardState)) {
                    console.log(`Illegal move: ${currentPlayer}'s King would be in check.`);
                    selectedPiece = null; 
                } else {
                    let pieceToPlaceOnBoard = pieceToMoveOriginal; 
                    if (pieceToMoveType === 'Pawn') {
                        const promotionRank = (pieceToMoveColor === 'white') ? 0 : 7;
                        if (row === promotionRank) {
                            pieceToPlaceOnBoard = handlePawnPromotion(pieceToMoveColor);
                        }
                    }
                    
                    initialBoardState[row][col] = pieceToPlaceOnBoard; 
                    initialBoardState[selectedPiece.row][selectedPiece.col] = null;
                    
                    const opponentPlayer = (currentPlayer === 'white') ? 'black' : 'white';
                    
                    const kingIsInCheck = isKingInCheck(opponentPlayer, initialBoardState);
                    const opponentHasLegalMoves = hasLegalMoves(opponentPlayer, initialBoardState);

                    if (kingIsInCheck && !opponentHasLegalMoves) {
                        renderBoard(); 
                        alert(`Checkmate! ${currentPlayer} wins!`);
                        gameOver = true;
                        selectedPiece = null;
                        return; 
                    } else if (!kingIsInCheck && !opponentHasLegalMoves) {
                        renderBoard(); 
                        alert("Stalemate! The game is a draw.");
                        gameOver = true;
                        selectedPiece = null;
                        return; 
                    } else if (kingIsInCheck) {
                        console.log(`${opponentPlayer} king is in check!`);
                    }
                    
                    currentPlayer = opponentPlayer; 
                    selectedPiece = null; 
                }
            } else {
                console.log(`Invalid move for ${pieceToMoveType} from (${selectedPiece.row},${selectedPiece.col}) to (${row},${col}) for ${currentPlayer}`);
            }
        }
    } else { 
        if (clickedPieceChar && clickedPieceColor === currentPlayer) {
            selectedPiece = { row: row, col: col };
        } else if (clickedPieceChar && clickedPieceColor !== currentPlayer) {
            console.log(`Cannot select opponent's piece. Current player: ${currentPlayer}`);
        }
    }
    if (!gameOver) { 
        renderBoard();
    }
}

function initializeBoard() {
    const table = document.querySelector('table');
    if (!table) return;

    // Setup cell click listeners
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const cell = table.rows[i]?.cells[j];
            if (cell) {
                cell.addEventListener('click', ((r, c) => () => handleCellClick(r, c))(i, j));
            }
        }
    }

    // Setup reset button listener
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.addEventListener('click', resetGame);
    } else {
        console.error("Reset button not found!");
    }

    renderBoard(); 
}

window.onload = initializeBoard;
