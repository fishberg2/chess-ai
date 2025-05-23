QUnit.module('Piece Identification', function() {
  QUnit.test('getPieceColor', function(assert) {
    assert.equal(getPieceColor('P'), 'white', 'White pawn');
    assert.equal(getPieceColor('p'), 'black', 'Black pawn');
    assert.equal(getPieceColor('K'), 'white', 'White King');
    assert.equal(getPieceColor('k'), 'black', 'Black King');
    assert.equal(getPieceColor('R'), 'white', 'White Rook');
    assert.equal(getPieceColor('r'), 'black', 'Black Rook');
    assert.equal(getPieceColor(null), null, 'Empty square (null)');
    assert.equal(getPieceColor(''), null, 'Empty square (empty string)');
  });

  QUnit.test('getPieceType', function(assert) {
    assert.equal(getPieceType('P'), 'Pawn', 'White Pawn');
    assert.equal(getPieceType('p'), 'Pawn', 'Black Pawn');
    assert.equal(getPieceType('N'), 'Knight', 'White Knight');
    assert.equal(getPieceType('n'), 'Knight', 'Black Knight');
    assert.equal(getPieceType('B'), 'Bishop', 'White Bishop');
    assert.equal(getPieceType('b'), 'Bishop', 'Black Bishop');
    assert.equal(getPieceType('R'), 'Rook', 'White Rook');
    assert.equal(getPieceType('r'), 'Rook', 'Black Rook');
    assert.equal(getPieceType('Q'), 'Queen', 'White Queen');
    assert.equal(getPieceType('q'), 'Queen', 'Black Queen');
    assert.equal(getPieceType('K'), 'King', 'White King');
    assert.equal(getPieceType('k'), 'King', 'Black King');
    assert.equal(getPieceType(null), null, 'Empty square (null)');
    assert.equal(getPieceType(''), null, 'Empty square (empty string)');
  });
});

QUnit.module('Pawn Moves', function(hooks) {
  hooks.beforeEach(function() {
    this.board = getInitialBoardSetup(); // Use a fresh board for each pawn test
  });

  QUnit.test('isValidPawnMove - White', function(assert) {
    // White pawn at initial position (e.g., e2 -> board[6][4])
    assert.ok(isValidPawnMove(this.board, 6, 4, 5, 4, 'white'), 'Move 1 square forward (e2-e3)');
    assert.ok(isValidPawnMove(this.board, 6, 4, 4, 4, 'white'), 'Move 2 squares forward initially (e2-e4)');
    
    this.board[5][4] = 'p'; // Block with black pawn
    assert.notOk(isValidPawnMove(this.board, 6, 4, 5, 4, 'white'), 'Blocked 1 square forward by enemy (e2-e3)');
    assert.notOk(isValidPawnMove(this.board, 6, 4, 4, 4, 'white'), 'Blocked 2 squares forward (path) by enemy (e2-e4)');
    
    this.board[5][4] = 'P'; // Block with white pawn
    assert.notOk(isValidPawnMove(this.board, 6, 4, 5, 4, 'white'), 'Blocked 1 square forward by own piece');

    this.board = getInitialBoardSetup(); // Reset board
    this.board[5][3] = 'p'; // Enemy pawn at d4 for capture
    assert.ok(isValidPawnMove(this.board, 6, 4, 5, 3, 'white'), 'Capture left (e2xd3)');
    this.board[5][5] = 'p'; // Enemy pawn at f4 for capture
    assert.ok(isValidPawnMove(this.board, 6, 4, 5, 5, 'white'), 'Capture right (e2xf3)');

    this.board[5][3] = 'P'; // Own pawn at d4
    assert.notOk(isValidPawnMove(this.board, 6, 4, 5, 3, 'white'), 'Cannot capture own piece (left)');
    
    // Non-initial move
    this.board = getInitialBoardSetup();
    this.board[5][4] = 'P'; // White pawn at e3
    assert.ok(isValidPawnMove(this.board, 5, 4, 4, 4, 'white'), 'Move 1 square forward from e3-e4');
    assert.notOk(isValidPawnMove(this.board, 5, 4, 3, 4, 'white'), 'Cannot move 2 squares forward after initial move');
    assert.notOk(isValidPawnMove(this.board, 6, 4, 6, 4, 'white'), 'Cannot stay in place');
    assert.notOk(isValidPawnMove(this.board, 6, 4, 5, 5, 'white'), 'Cannot move diagonally to empty square');
  });

  QUnit.test('isValidPawnMove - Black', function(assert) {
    // Black pawn at initial position (e.g., d7 -> board[1][3])
    assert.ok(isValidPawnMove(this.board, 1, 3, 2, 3, 'black'), 'Move 1 square forward (d7-d6)');
    assert.ok(isValidPawnMove(this.board, 1, 3, 3, 3, 'black'), 'Move 2 squares forward initially (d7-d5)');

    this.board[2][3] = 'P'; // Block with white pawn
    assert.notOk(isValidPawnMove(this.board, 1, 3, 2, 3, 'black'), 'Blocked 1 square forward by enemy (d7-d6)');
    assert.notOk(isValidPawnMove(this.board, 1, 3, 3, 3, 'black'), 'Blocked 2 squares forward (path) by enemy (d7-d5)');

    this.board[2][3] = 'p'; // Block with black pawn
    assert.notOk(isValidPawnMove(this.board, 1, 3, 2, 3, 'black'), 'Blocked 1 square forward by own piece');

    this.board = getInitialBoardSetup(); // Reset board
    this.board[2][2] = 'P'; // Enemy pawn at c3 for capture
    assert.ok(isValidPawnMove(this.board, 1, 3, 2, 2, 'black'), 'Capture left (d7xc3)');
    this.board[2][4] = 'P'; // Enemy pawn at e3 for capture
    assert.ok(isValidPawnMove(this.board, 1, 3, 2, 4, 'black'), 'Capture right (d7xe3)');

    this.board[2][2] = 'p'; // Own pawn at c3
    assert.notOk(isValidPawnMove(this.board, 1, 3, 2, 2, 'black'), 'Cannot capture own piece (left)');
  });
});

QUnit.module('Knight Moves', function(hooks) {
  hooks.beforeEach(function() {
    this.board = getInitialBoardSetup();
    this.board[3][3] = 'N'; // White Knight at d4
  });

  QUnit.test('isValidKnightMove', function(assert) {
    const fromR = 3, fromC = 3; // d4
    // Valid moves
    assert.ok(isValidKnightMove(this.board, fromR, fromC, 1, 2, 'white'), 'd4 to c2'); // up 2 left 1
    assert.ok(isValidKnightMove(this.board, fromR, fromC, 1, 4, 'white'), 'd4 to e2'); // up 2 right 1
    assert.ok(isValidKnightMove(this.board, fromR, fromC, 2, 1, 'white'), 'd4 to b3'); // up 1 left 2
    assert.ok(isValidKnightMove(this.board, fromR, fromC, 2, 5, 'white'), 'd4 to f3'); // up 1 right 2
    assert.ok(isValidKnightMove(this.board, fromR, fromC, 4, 1, 'white'), 'd4 to b5'); // down 1 left 2
    assert.ok(isValidKnightMove(this.board, fromR, fromC, 4, 5, 'white'), 'd4 to f5'); // down 1 right 2
    assert.ok(isValidKnightMove(this.board, fromR, fromC, 5, 2, 'white'), 'd4 to c6'); // down 2 left 1
    assert.ok(isValidKnightMove(this.board, fromR, fromC, 5, 4, 'white'), 'd4 to e6'); // down 2 right 1

    // Invalid moves (not L-shape)
    assert.notOk(isValidKnightMove(this.board, fromR, fromC, 3, 4, 'white'), 'd4 to e4 (straight)');
    assert.notOk(isValidKnightMove(this.board, fromR, fromC, 4, 4, 'white'), 'd4 to e5 (diagonal)');
    
    // Capture enemy piece
    this.board[1][2] = 'p'; // black pawn at c2
    assert.ok(isValidKnightMove(this.board, fromR, fromC, 1, 2, 'white'), 'd4 to c2 (capture black pawn)');

    // Cannot move to square occupied by own piece
    this.board[1][2] = 'P'; // white pawn at c2
    assert.notOk(isValidKnightMove(this.board, fromR, fromC, 1, 2, 'white'), 'd4 to c2 (blocked by own pawn)');
    
    // Knight can jump over pieces
    this.board = getInitialBoardSetup();
    this.board[0][1] = 'n'; // Black knight at b1
    this.board[1][1] = 'p'; // black pawn at b2 (blocking for other pieces, not knight)
    this.board[2][1] = 'p'; // black pawn at b3
    assert.ok(isValidKnightMove(this.board, 0, 1, 2, 2, 'black'), 'b1 to c3 (jumping over b2)');
  });
});

QUnit.module('Rook Moves', function(hooks) {
  hooks.beforeEach(function() {
    this.board = getInitialBoardSetup(); // Clear board for rook tests
    for(let r=0; r<8; r++) for(let c=0; c<8; c++) this.board[r][c] = null;
    this.board[3][3] = 'R'; // White Rook at d4
  });

  QUnit.test('isValidRookMove', function(assert) {
    const fromR = 3, fromC = 3; // d4
    // Valid moves
    assert.ok(isValidRookMove(this.board, fromR, fromC, 3, 0, 'white'), 'd4 to a4 (horizontal left)');
    assert.ok(isValidRookMove(this.board, fromR, fromC, 3, 7, 'white'), 'd4 to h4 (horizontal right)');
    assert.ok(isValidRookMove(this.board, fromR, fromC, 0, 3, 'white'), 'd4 to d1 (vertical up)');
    assert.ok(isValidRookMove(this.board, fromR, fromC, 7, 3, 'white'), 'd4 to d8 (vertical down)');

    // Invalid moves (diagonal)
    assert.notOk(isValidRookMove(this.board, fromR, fromC, 4, 4, 'white'), 'd4 to e5 (diagonal)');

    // Blocked path
    this.board[3][1] = 'p'; // Black pawn at b4
    assert.notOk(isValidRookMove(this.board, fromR, fromC, 3, 0, 'white'), 'd4 to a4 (blocked by b4)');
    this.board[3][1] = null; // Clear obstruction

    this.board[1][3] = 'P'; // White pawn at d2
    assert.notOk(isValidRookMove(this.board, fromR, fromC, 0, 3, 'white'), 'd4 to d1 (blocked by d2 - own piece)');
    
    // Capture enemy piece
    this.board[3][7] = 'r'; // Black rook at h4
    assert.ok(isValidRookMove(this.board, fromR, fromC, 3, 7, 'white'), 'd4 to h4 (capture black rook)');

    // Cannot move to square occupied by own piece
    this.board[3][7] = 'N'; // White knight at h4
    assert.notOk(isValidRookMove(this.board, fromR, fromC, 3, 7, 'white'), 'd4 to h4 (blocked by own knight)');
  });
});

QUnit.module('Bishop Moves', function(hooks) {
  hooks.beforeEach(function() {
    this.board = getInitialBoardSetup(); 
    for(let r=0; r<8; r++) for(let c=0; c<8; c++) this.board[r][c] = null;
    this.board[3][3] = 'B'; // White Bishop at d4
  });

  QUnit.test('isValidBishopMove', function(assert) {
    const fromR = 3, fromC = 3; // d4
    // Valid moves
    assert.ok(isValidBishopMove(this.board, fromR, fromC, 0, 0, 'white'), 'd4 to a1 (diag up-left)');
    assert.ok(isValidBishopMove(this.board, fromR, fromC, 0, 6, 'white'), 'd4 to g1 (diag up-right)');
    assert.ok(isValidBishopMove(this.board, fromR, fromC, 6, 0, 'white'), 'd4 to a7 (diag down-left)');
    assert.ok(isValidBishopMove(this.board, fromR, fromC, 6, 6, 'white'), 'd4 to g7 (diag down-right)');

    // Invalid moves (straight)
    assert.notOk(isValidBishopMove(this.board, fromR, fromC, 3, 5, 'white'), 'd4 to f4 (horizontal)');

    // Blocked path
    this.board[1][1] = 'p'; // Black pawn at b2
    assert.notOk(isValidBishopMove(this.board, fromR, fromC, 0, 0, 'white'), 'd4 to a1 (blocked by b2)');
    this.board[1][1] = null; 

    this.board[5][1] = 'P'; // White pawn at b6
    assert.notOk(isValidBishopMove(this.board, fromR, fromC, 6, 0, 'white'), 'd4 to a7 (blocked by b6 - own piece)');
    
    // Capture enemy piece
    this.board[0][6] = 'b'; // Black bishop at g1
    assert.ok(isValidBishopMove(this.board, fromR, fromC, 0, 6, 'white'), 'd4 to g1 (capture black bishop)');

    // Cannot move to square occupied by own piece
    this.board[0][6] = 'N'; // White knight at g1
    assert.notOk(isValidBishopMove(this.board, fromR, fromC, 0, 6, 'white'), 'd4 to g1 (blocked by own knight)');
  });
});

QUnit.module('Queen Moves', function(hooks) {
  hooks.beforeEach(function() {
    this.board = getInitialBoardSetup();
    for(let r=0; r<8; r++) for(let c=0; c<8; c++) this.board[r][c] = null;
    this.board[3][3] = 'Q'; // White Queen at d4
  });

  QUnit.test('isValidQueenMove', function(assert) {
    const fromR = 3, fromC = 3; // d4
    // Valid straight moves
    assert.ok(isValidQueenMove(this.board, fromR, fromC, 3, 0, 'white'), 'd4 to a4 (horizontal)');
    assert.ok(isValidQueenMove(this.board, fromR, fromC, 0, 3, 'white'), 'd4 to d1 (vertical)');
    // Valid diagonal moves
    assert.ok(isValidQueenMove(this.board, fromR, fromC, 0, 0, 'white'), 'd4 to a1 (diagonal)');
    assert.ok(isValidQueenMove(this.board, fromR, fromC, 6, 6, 'white'), 'd4 to g7 (diagonal)');

    // Invalid moves (knight L-shape)
    assert.notOk(isValidQueenMove(this.board, fromR, fromC, 1, 2, 'white'), 'd4 to c2 (knight move)');

    // Blocked path (straight)
    this.board[3][1] = 'p'; 
    assert.notOk(isValidQueenMove(this.board, fromR, fromC, 3, 0, 'white'), 'd4 to a4 (blocked by b4)');
    this.board[3][1] = null; 

    // Blocked path (diagonal)
    this.board[1][1] = 'P'; 
    assert.notOk(isValidQueenMove(this.board, fromR, fromC, 0, 0, 'white'), 'd4 to a1 (blocked by b2 - own piece)');
    this.board[1][1] = null;

    // Capture enemy piece
    this.board[0][3] = 'q'; 
    assert.ok(isValidQueenMove(this.board, fromR, fromC, 0, 3, 'white'), 'd4 to d1 (capture black queen)');
  });
});

QUnit.module('King Moves', function(hooks) {
  hooks.beforeEach(function() {
    this.board = getInitialBoardSetup();
    for(let r=0; r<8; r++) for(let c=0; c<8; c++) this.board[r][c] = null;
    this.board[3][3] = 'K'; // White King at d4
  });

  QUnit.test('isValidKingMove', function(assert) {
    const fromR = 3, fromC = 3; // d4
    // Valid moves (1 step)
    assert.ok(isValidKingMove(this.board, fromR, fromC, 2, 3, 'white'), 'd4 to d3 (up)');
    assert.ok(isValidKingMove(this.board, fromR, fromC, 4, 3, 'white'), 'd4 to d5 (down)');
    assert.ok(isValidKingMove(this.board, fromR, fromC, 3, 2, 'white'), 'd4 to c4 (left)');
    assert.ok(isValidKingMove(this.board, fromR, fromC, 3, 4, 'white'), 'd4 to e4 (right)');
    assert.ok(isValidKingMove(this.board, fromR, fromC, 2, 2, 'white'), 'd4 to c3 (diag up-left)');
    assert.ok(isValidKingMove(this.board, fromR, fromC, 4, 4, 'white'), 'd4 to e5 (diag down-right)');

    // Invalid moves (more than 1 step)
    assert.notOk(isValidKingMove(this.board, fromR, fromC, 1, 3, 'white'), 'd4 to d2 (2 steps up)');
    assert.notOk(isValidKingMove(this.board, fromR, fromC, 5, 5, 'white'), 'd4 to f6 (2 steps diag)');
    
    // Capture enemy piece
    this.board[2][3] = 'k'; // Black king at d3
    assert.ok(isValidKingMove(this.board, fromR, fromC, 2, 3, 'white'), 'd4 to d3 (capture black king)');

    // Cannot move to square occupied by own piece
    this.board[2][3] = 'P'; // White pawn at d3
    assert.notOk(isValidKingMove(this.board, fromR, fromC, 2, 3, 'white'), 'd4 to d3 (blocked by own pawn)');
    // Castling is not tested here as it's not implemented
  });
});

QUnit.module('Check Logic', function(hooks) {
  hooks.beforeEach(function() {
    this.board = getInitialBoardSetup();
    for(let r=0; r<8; r++) for(let c=0; c<8; c++) this.board[r][c] = null; // Clear board
  });

  QUnit.test('isKingInCheck', function(assert) {
    this.board[0][4] = 'k'; // Black king at e1
    this.board[7][4] = 'K'; // White king at e8 (to avoid auto-check issues with only one king)
    
    this.board[0][0] = 'R'; // White rook at a1
    assert.ok(isKingInCheck('black', this.board), 'Black king in check from white rook (a1 to e1)');
    this.board[0][0] = null; // Remove rook

    this.board[2][3] = 'N'; // White knight at d3
    assert.ok(isKingInCheck('black', this.board), 'Black king in check from white knight (d3 to e1)');
    this.board[2][3] = null;

    this.board[2][2] = 'B'; // White bishop at c3
    assert.ok(isKingInCheck('black', this.board), 'Black king in check from white bishop (c3 to e1)');
    this.board[2][2] = null;

    assert.notOk(isKingInCheck('black', this.board), 'Black king not in check');
    assert.notOk(isKingInCheck('white', this.board), 'White king not in check');
  });

  QUnit.test('isMovePuttingKingInCheck', function(assert) {
    // Setup: White King at e1, Black Rook at e8, White Rook at d1
    // White wants to move its Rook from d1 to c1. This should be fine.
    // White wants to move its King from e1 to d1. This would put it in check from e8 black rook.
    this.board[0][4] = 'K'; // White King at e1
    this.board[0][3] = 'R'; // White Rook at d1
    this.board[7][4] = 'r'; // Black Rook at e8
    this.board[7][0] = 'k'; // Black king at a8 (to avoid other checks)

    assert.notOk(isMovePuttingKingInCheck(0, 3, 0, 2, 'white', this.board), 'Moving R from d1 to c1 does not put white king in check');
    assert.ok(isMovePuttingKingInCheck(0, 4, 0, 3, 'white', this.board), 'Moving K from e1 to d1 PUTS white king in check from black rook at e8');
    
    // Test scenario: moving a piece that exposes the king
    this.board = getInitialBoardSetup(); // Clear
    this.board[0][4] = 'K'; // White King at e1
    this.board[1][4] = 'P'; // White Pawn at e2 (blocking)
    this.board[2][4] = 'r'; // Black Rook at e3 (aiming at e1)
    this.board[7][7] = 'k'; // Black king for completeness
    assert.ok(isMovePuttingKingInCheck(1, 4, 2, 3, 'white', this.board), 'Moving P from e2 to d3 (capture) exposes K to check from r at e3');
    assert.notOk(isMovePuttingKingInCheck(0, 4, 0, 3, 'white', this.board), 'Moving K from e1 to d1 does not put K in check (rook is blocked)');
  });
});

QUnit.module('Game End Logic', function(hooks) {
  hooks.beforeEach(function() {
    this.board = getInitialBoardSetup();
    for(let r=0; r<8; r++) for(let c=0; c<8; c++) this.board[r][c] = null; // Clear board
  });

  // Basic Fool's Mate setup (Black Checkmates White)
  QUnit.test('Checkmate - Fool\'s Mate (simplified)', function(assert) {
    //   k . . . . . . .
    //   . . . . . . . .
    //   . . . . . . . .
    //   . . . . q . . .  (black queen at e4)
    //   . . . P . . . .  (white pawn at d5, no legal moves for white king)
    //   . . P . . . . .  (white pawn at c6)
    //   . . . . . . . .
    //   . . . . K . . .  (white king at e8)
    this.board[0][4] = 'k'; // black king
    this.board[3][4] = 'q'; // black queen at e4
    this.board[4][3] = 'P'; // white pawn at d5
    this.board[5][2] = 'P'; // white pawn at c6
    this.board[7][4] = 'K'; // white king at e8 (target of checkmate)

    assert.ok(isKingInCheck('white', this.board), "White king is in check by queen");
    assert.notOk(hasLegalMoves('white', this.board), "White has no legal moves (checkmate)");
  });

  QUnit.test('Stalemate - King trapped, no check', function(assert) {
    //   k . . . . . . .
    //   . . . . . . . .
    //   . . . . . . . .
    //   . . . . . . . .
    //   . . . . . Q . .  (white queen at f5, controls d7,e7,f7,d6,f6,d4,f4,e5,g5,h5)
    //   . . . . . . . .
    //   . . . . . . . K  (white king at h7 for completeness)
    //   . . . . . . k .  (black king at h8, no legal moves, not in check)
    this.board[0][0] = 'k'; // placeholder black king
    this.board[4][5] = 'Q'; // white queen at f5
    this.board[6][7] = 'K'; // white king at h7
    this.board[7][7] = 'k'; // black king at h8 (target of stalemate)
    
    // Ensure h8 is not attackable by Q@f5
    // Q@f5 (4,5) -> k@h8 (7,7) is valid queen move but is it putting king in check?
    // isValidQueenMove(this.board, 4, 5, 7, 7, 'white') should be true
    
    assert.notOk(isKingInCheck('black', this.board), "Black king is NOT in check");
    assert.notOk(hasLegalMoves('black', this.board), "Black has no legal moves (stalemate)");
  });
});


QUnit.module('Pawn Promotion Logic', function(hooks) {
    hooks.beforeEach(function() {
        this.board = getInitialBoardSetup();
        for(let r=0; r<8; r++) for(let c=0; c<8; c++) this.board[r][c] = null;
        this.originalPrompt = window.prompt; // Save original prompt
    });
    hooks.afterEach(function() {
        window.prompt = this.originalPrompt; // Restore original prompt
    });

    QUnit.test('White Pawn Promotion to Queen', function(assert) {
        this.board[1][4] = 'P'; // White pawn at e7, about to promote to e8 (board[0][4])
        this.board[7][7] = 'k'; // black king
        this.board[6][0] = 'K'; // white king

        // Mock prompt to automatically choose 'Q'
        window.prompt = function(message, defaultValue) {
            assert.equal(message, "Promote pawn to (Q, R, B, N):", "Prompt message is correct");
            assert.equal(defaultValue, "Q", "Default prompt value is Q");
            return "Q";
        };
        
        // Simulate the part of handleCellClick that calls handlePawnPromotion
        const pieceToMoveColor = 'white';
        const toRow = 0, toCol = 4; // Promotion square e8
        const fromRow = 1, fromCol = 4; // Original square e7

        let pieceToPlaceOnBoard = getPieceAt(this.board, fromRow, fromCol);
        const pieceToMoveType = getPieceType(pieceToPlaceOnBoard);
        
        if (pieceToMoveType === 'Pawn') {
            const promotionRank = (pieceToMoveColor === 'white') ? 0 : 7;
            if (toRow === promotionRank) {
                 // This is what handleCellClick does:
                pieceToPlaceOnBoard = handlePawnPromotion(pieceToMoveColor);
            }
        }
        this.board[toRow][toCol] = pieceToPlaceOnBoard;
        this.board[fromRow][fromCol] = null;

        assert.equal(getPieceAt(this.board, toRow, toCol), 'Q', 'Pawn promoted to White Queen (Q)');
        assert.equal(getPieceAt(this.board, fromRow, fromCol), null, 'Original pawn square is empty');
    });

    QUnit.test('Black Pawn Promotion to Knight (user choice "n")', function(assert) {
        this.board[6][3] = 'p'; // Black pawn at d2, about to promote to d1 (board[7][3])
        this.board[0][0] = 'K'; // white king
        this.board[1][7] = 'k'; // black king

        window.prompt = function() { return "N"; }; // Mock prompt for Knight
        
        const pieceToMoveColor = 'black';
        const toRow = 7, toCol = 3; // Promotion square d1
        const fromRow = 6, fromCol = 3; // Original square d2

        let pieceToPlaceOnBoard = getPieceAt(this.board, fromRow, fromCol);
        const pieceToMoveType = getPieceType(pieceToPlaceOnBoard);

        if (pieceToMoveType === 'Pawn') {
            const promotionRank = (pieceToMoveColor === 'white') ? 0 : 7;
            if (toRow === promotionRank) {
                pieceToPlaceOnBoard = handlePawnPromotion(pieceToMoveColor);
            }
        }
        this.board[toRow][toCol] = pieceToPlaceOnBoard;
        this.board[fromRow][fromCol] = null;

        assert.equal(getPieceAt(this.board, toRow, toCol), 'n', 'Pawn promoted to Black Knight (n)');
    });
});
