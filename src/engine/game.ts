import { getPiece, movePiece } from "./board";
import type { GameState, Position, Color, CastlingRights } from "./types";


function clearCorner(castling: CastlingRights, pos: Position): void{
    if(pos.row === 7 && pos.col === 0) castling.wQ = false;
    if(pos.row === 7 && pos.col === 7) castling.wK = false;
    if(pos.row === 0 && pos.col === 0) castling.bQ = false;
    if(pos.row === 0 && pos.col === 7) castling.bK = false;
}

export function applyMove(state: GameState, from: Position, to: Position): GameState{
    const newBoard = movePiece(state.board, from, to);
    const piece = getPiece(state.board, from);
    if (piece !== null && piece.type === 'k' && Math.abs(to.col - from.col) === 2){
        let row = from.row;
    }
    if (piece !== null && piece.type === 'p' && from.col !== to.col && getPiece(state.board, to) === null){
        newBoard[from.row][to.col] = null;
    }
    const newCastling = { ...state.castling};
    clearCorner(newCastling, from);
    clearCorner(newCastling, to);
    if (piece !== null && piece.type === 'k'){
        if (piece.color === 'w'){
            newCastling.wK = false;
            newCastling.wQ = false;
        } else {
            newCastling.bK = false;
            newCastling.bQ = false;
        }
    }
    let newEnPassant: Position | null = null;
    if (piece !== null && piece.type === 'p' && Math.abs(to.row - from.row) === 2){
        newEnPassant = {
            row: (from.row + to.row) / 2, col: from.col
        }
    }
    const newTurn : Color = state.turn === 'w' ? 'b' : 'w';
    return { ...state, board: newBoard, turn: newTurn, enPassant: newEnPassant, castling: newCastling}
}