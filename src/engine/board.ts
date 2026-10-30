import type { Board, Piece, PieceType, Position, Square, Color } from "./types";

const BACK_RANK : PieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];

function emptyRow(): Square[]{
    return Array.from({ length: 8}, () => null);
}

function pawnRow(color: Color): Square[]{
    return Array.from({length: 8}, (): Piece => ({ color, type: 'p'}));
}

function backRow(color: Color): Square[]{
    return BACK_RANK.map((type): Piece => ({ color, type}));
}

export function createInitialBoard(): Board{
    return [
        backRow('b'),
        pawnRow('b'),
        emptyRow(), emptyRow(), emptyRow(), emptyRow(),
        pawnRow('w'),
        backRow('w'),
    ];
}

export function cloneBoard(board: Board): Board{
    //TODO: new outer array, new inner arrays
    //pieces are never mutated, so copying the rows is enough
    return board.map(row => [...row]);
}

//checks that the position is indeed on the board
export function isInside(pos: Position): boolean{
    //TODO: row and col both between 0 and 7
    if (pos.row >= 0 && pos.row <= 7 && pos.col >= 0 && pos.col <= 7){
        return true;
    }
    return false;
}

export function getPiece(board: Board, pos: Position): Square{
    //TODO: return board[pos.row][pos.col]
    if (isInside(pos) !== true) {
        return null;
    }

    else {
        return board[pos.row][pos.col];
    }

}

export function  movePiece(board: Board, from: Position, to: Position): Board {
    //TODO: clone, copy piece to 'to', set 'from' to null, return the clone
    const newBoard = cloneBoard(board);

    const piece = getPiece(board, from);
    if (piece === null) return newBoard;

    newBoard[to.row][to.col] = piece;
    const lastRow = piece.color === 'w' ? 0 : 7;
    if (piece.type === 'p' && to.row === lastRow){
        const newPiece: Piece = { color: piece.color, type: 'q'};
        newBoard[to.row][to.col] = newPiece;
    }
    newBoard[from.row][from.col] = null;

    return newBoard;
}