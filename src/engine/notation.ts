import { getPiece } from "./board";
import { getLegalMoves } from "./check";
import type { GameState, PieceType, Position } from "./types";

const LETTERS: Record<PieceType, string> = { k: 'K', q: 'Q', r: 'R', b: 'B', n: 'N', p: ''};

function squareName(pos: Position): string {
    return 'abcdefgh'[pos.col] + (8 - pos.row);
}

export function moveToSan(before: GameState, from: Position, to: Position, promotion?: PieceType): string {
    const piece = getPiece(before.board, from)!;
    if (piece.type === 'k' && Math.abs(to.col - from.col) === 2) {
        return to.col === 6 ? 'O-O' : 'O-O-O';
    }
    const target = getPiece(before.board, to);
    const isEnPassant = piece.type === 'p' && from.col !== to.col && target === null;
    const isCapture = target !== null || isEnPassant;
    const rivals: Position[] = [];
    if (piece.type !== 'p' && piece.type !== 'k') {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (row === from.row && col === from.col) continue;
                const other = getPiece(before.board, { row, col });
                if (other === null || other.type !== piece.type || other.color !== piece.color) continue;
                const canReach = getLegalMoves(before, { row, col })
                    .some(m => m.row === to.row && m.col === to.col);
                if (canReach) rivals.push({ row, col });
            }
        }
    }
    let san = LETTERS[piece.type];
    if (rivals.length > 0) {
        const sameFile = rivals.some(r => r.col === from.col);
        const sameRank = rivals.some(r => r.row === from.row);
        if (!sameFile) san += 'abcdefgh'[from.col];
        else if (!sameRank) san += 8 - from.row;
        else san += squareName(from);
    }
    if (piece.type === 'p' && isCapture) san += 'abcdefgh'[from.col];
    if (isCapture) san += 'x';
    san += squareName(to);
    if (promotion) san += '=' + promotion.toUpperCase();
    return san;
}