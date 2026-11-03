import { getPieceMoves, getMoves } from "./moves";
import type { Board, Color, Position, GameState } from "./types";
import { getPiece, movePiece } from "./board";

export function findKing(board:Board, color:Color):Position | null{
    for (let row = 0; row < 8; row++){
        for (let col = 0; col < 8; col++){
            const piece = getPiece(board, {row, col});
            if (piece !== null && piece.type === 'k' && piece.color === color){
                return { row, col};
            }
        }
    }
    return null;
}

export function isSquareAttacked(board: Board, target: Position, byColor: Color): boolean{
    for (let row = 0; row < 8; row++){
        for (let col = 0; col < 8; col++){
            const piece = getPiece(board, {row, col});
            if (piece === null || piece.color !== byColor) continue;
            else if( piece.type === 'p'){
                const direction = piece.color === 'w' ? -1 : 1;
                const dCol = [-1, 1];
                for (let i = 0; i < dCol.length; i++){
                    const diagonalSquare = {row: row + direction, col: col + dCol[i]};
                    if (diagonalSquare.row === target.row && diagonalSquare.col === target.col){
                        return true;
                    }
                }
            } else {
                const attack = getPieceMoves(board, { row, col });
                const ok = attack.some(m => m.row === target.row && m.col === target.col);
                if (ok){ return true; }
            }
        }
    }
    return false;
}

export function isInCheck(board: Board, color: Color): Boolean{
    const king = findKing(board, color);
    const enemy = color === 'w' ? 'b' : 'w';
    if (king === null){
        return false;
    }
    return isSquareAttacked(board, king, enemy);
}

export function getLegalMoves(state: GameState, pos: Position): Position[]{
    const piece = getPiece(state.board, pos);
    if (piece === null){ return [] };

    const candidates = getMoves(state, pos);
    const row = piece.color === 'w' ? 7 : 0;
    const enemy = piece.color === 'w' ? 'b' : 'w';
    const legal = candidates.filter(move => {
        const next = movePiece(state.board, pos, move);
        return !isInCheck(next, piece.color)
    })
    if (piece.type === 'k' && pos.row === row && pos.col === 4 && !isInCheck(state.board, piece.color)){
        const canKingSide = piece.color === 'w' ? state.castling.wK : state.castling.bK;
        const canQueenSide = piece.color === 'w' ? state.castling.wQ : state.castling.bQ;
        const fEmpty = getPiece(state.board, { row, col: 5 }) === null;
        const gEmpty = getPiece(state.board, { row, col: 6 }) === null;
        const fSafe = !isSquareAttacked(state.board, { row, col: 5 }, enemy);
        const gSafe = !isSquareAttacked(state.board, { row, col: 6 }, enemy);
        const bEmpty = getPiece(state.board, { row, col: 1}) === null;
        const cEmpty = getPiece(state.board, { row, col: 2}) === null;
        const dEmpty = getPiece(state.board, { row, col: 3}) === null;
        const cSafe = !isSquareAttacked(state.board, { row, col: 2}, enemy);
        const dSafe = !isSquareAttacked(state.board, { row, col: 3}, enemy);

        if (canKingSide && fEmpty && gEmpty && fSafe && gSafe){
            legal.push({ row, col: 6})
        }
        if (canQueenSide && bEmpty && cEmpty && dEmpty && cSafe && dSafe){
            legal.push({ row, col: 2})
        }
    }
    return legal;
}

export function hasLegalMoves(state: GameState): boolean{
    for (let row = 0; row < 8; row++){
        for (let col = 0; col < 8; col++){
            const piece = getPiece(state.board, {row, col});
            if (piece !== null && piece.color === state.turn){
                const moves = getLegalMoves(state, {row, col});
                if (moves.length > 0) return true;
            }
        }
    }
    return false;
}