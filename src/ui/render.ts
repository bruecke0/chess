import { getPiece } from '../engine/board';
import type { Board, Color, PieceType, Position } from '../engine/types';

const SYMBOLS: Record<Color, Record<PieceType, string>> = {
    w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
    b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
};

export function renderBoard(
    board: Board, 
    container: HTMLElement, 
    onSquareClick: (pos: Position) => void,
    selected: Position | null,
    targets: Position[],
    lastMove: { from: Position; to: Position} | null,
): void {
    container.innerHTML = '';

    const boardE1 = document.createElement('div');
    boardE1.className = 'board';

    for (let row = 0; row < 8; row++){
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = 'square';
            const piece = getPiece(board, {row, col});
            if (piece) {
                square.textContent = SYMBOLS[piece.color][piece.type] + '\uFE0E';
            }
            if (selected && selected.row === row && selected.col === col) {
                square.classList.add('selected');
            }
            if (targets.some(t => t.row === row && t.col === col)){
                square.classList.add('target')
            }
            if (
                lastMove && 
                ((lastMove.from.row === row && lastMove.from.col === col) || 
                (lastMove.to.row === row && lastMove.to.col === col))
            ) {
                square.classList.add('last-move');
            }
            square.addEventListener('click', () => onSquareClick({ row, col }));
            const isLight = (row + col) % 2 === 0;
            square.classList.add(isLight ? 'light' : 'dark')
            boardE1.appendChild(square);
        }
    }
    container.appendChild(boardE1);
}

export function renderPromotion(
    container: HTMLElement,
    color: Color,
    onChoose: (type: PieceType) => void,
): void {
    container.innerHTML = '';
    const choices : PieceType[] = ['q', 'r', 'b', 'n'];

    for (const type of choices){
        const button = document.createElement('button');
        button.textContent = SYMBOLS[color][type] + '\uFE0E';
        button.addEventListener('click', () => onChoose(type));
        container.appendChild(button);
    }
}
