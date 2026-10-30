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

export function isInCheck(board: Board, color: Color){
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

    const canditates = getMoves(state, pos);

    return canditates.filter(move => {
        const next = movePiece(state.board, pos, move);
        return !isInCheck(next, piece.color)
    })
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