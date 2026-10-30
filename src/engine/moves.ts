import type { Board, GameState, Position } from "./types";
import { getPiece, isInside } from "./board";

const KNIGHT_OFFSETS: [number, number][] = [
    [-2, -1], [-2, 1],
    [-1, -2], [-1, 2],
    [1, -2], [1, 2],
    [2, -1], [2, 1],
];

const KING_OFFSETS: [number, number][] = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1],
];

const ROOK_DIRECTIONS : [number, number][] = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
];

const BISHOP_DIRECTIONS: [number, number][] = [
    [-1, -1], [1, 1], [1, -1], [-1, 1],
];

const QUEEN_DIRECTIONS: [number, number][] = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [1, 1], [1, -1], [-1, 1],
];

export function getKnightMoves(
    board: Board,
    pos: Position
): Position[] {
    return getStepMoves(board, pos, KNIGHT_OFFSETS);
}

export function getKingMoves(
    board: Board, 
    pos: Position
): Position[] {
    return getStepMoves(board, pos, KING_OFFSETS);
}

export function getRookMoves(
    board: Board, 
    pos: Position
): Position[] {
    return getSlidingMoves(board, pos, ROOK_DIRECTIONS);
}

export function getBishopMoves(
    board: Board, 
    pos: Position
): Position[] {
    return getSlidingMoves(board, pos, BISHOP_DIRECTIONS);
}

export function getQueenMoves(
    board: Board, 
    pos: Position
): Position[] {
    return getSlidingMoves(board, pos, QUEEN_DIRECTIONS);
}


export function getPieceMoves(
    board: Board, 
    pos: Position
): Position[] {

    const piece = getPiece(board, pos);
    if (piece === null) {
        return []
    }
    switch (piece.type){
        case "n": return getKnightMoves(board, pos);
        case "p": return getPawnMoves(board, pos);
        case "b": return getBishopMoves(board, pos);
        case "r": return getRookMoves(board, pos);
        case "q": return getQueenMoves(board, pos);
        case "k": return getKingMoves(board, pos);
    }
}

export function getMoves(
    state: GameState, pos: Position
): Position[] {
    const moves = getPieceMoves(state.board, pos);
    const piece = getPiece(state.board, pos);
    if (piece === null || piece.type !== 'p'){
        return moves;
    }
    const direction = piece.color === 'w' ? -1 : 1;
    if (state.enPassant !== null){
        if (state.enPassant.row === pos.row + direction && Math.abs(state.enPassant.col - pos.col) === 1){
            moves.push(state.enPassant);
        }
    }
    return moves;
}

function getStepMoves(
    board: Board, 
    pos: Position, 
    offsets: [number, number][],
): Position[] {
    const piece = getPiece(board, pos);
    if (piece === null) return [];

    const moves: Position[] = [];
    
    for (const [dRow, dCol] of offsets) {
        const target = { row: pos.row + dRow, col: pos.col + dCol};

        if (!isInside(target)) continue;
        const occupant = getPiece(board, target);
        if (occupant === null || occupant.color !== piece.color) {
            moves.push(target);
        }
    }
    return moves;
}

function getSlidingMoves(
    board: Board, 
    pos: Position,
    directions: [number, number][],
): Position[] {
    const piece = getPiece(board, pos);
    if (piece === null) return [];

    const moves: Position[] = [];

    for (const [dRow, dCol] of directions){
        let target = { row: pos.row + dRow, col: pos.col + dCol};
        while (isInside(target)) {
            const occupant = getPiece(board, target);
            if (occupant === null) {
                moves.push(target);
                target = { row: target.row + dRow, col: target.col + dCol};
            }
            else if (occupant.color !== piece.color) {
                moves.push(target);
                break;
            }
            else {
                break;
            }
        }
    }
    return moves;
}

function getPawnMoves(
    board: Board,
    pos: Position,
): Position[] {
    const piece = getPiece(board, pos);
    if (piece === null) return [];
    
    const direction = piece.color === 'w' ? -1 : 1;
    const startRow = piece.color === 'w' ? 6 : 1;
    const moves: Position[] = [];
    const oneStep = { row: pos.row + direction, col: pos.col };
    const occupant = getPiece(board, oneStep);
    const oneStepFree = isInside(oneStep) && occupant === null;
    if (oneStepFree){
        moves.push(oneStep)
    }

    if (oneStepFree && pos.row === startRow){
        const twoStep = { row: pos.row + 2 * direction, col: pos.col};
        const occupant2 = getPiece(board, twoStep);
        if (isInside(twoStep) && occupant2 === null){
            moves.push(twoStep);
            
        }
    }

    const dCol = [-1, 1];
    for (let i = 0; i < dCol.length; i++){
        let target = { row: pos.row + direction, col: pos.col + dCol[i]}
        const occupant = getPiece(board, target)
        if (!isInside(target)) continue;
        if (occupant !== null && occupant.color !== piece.color){
            moves.push(target)
        }
    }
    return moves;
}
