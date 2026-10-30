import './style.css'
import { createInitialBoard, getPiece } from "./engine/board";
import { renderBoard } from "./ui/render";
import type { Position, GameState } from './engine/types';
import { getLegalMoves, hasLegalMoves, isInCheck } from './engine/check';
import { applyMove } from './engine/game';

const app = document.getElementById('app')!;
const status = document.getElementById('status')!;

let selected: Position | null = null;
let gameOver = false;

let state: GameState = {
  board: createInitialBoard(),
  turn: 'w',
  castling: { wK: true, wQ: true, bK: true, bQ: true},
  enPassant: null,
};

function handleClick(pos: Position): void {
  if (gameOver) return;
  if (selected === null) {
    const piece = getPiece(state.board, pos);
    if (piece !== null && piece.color === state.turn) selected = pos;
  } else {
    if (selected.row === pos.row && selected.col === pos.col) {
      selected = null;
    } else {
      const legal = getLegalMoves(state, selected);
      const ok = legal.some(m => m.row === pos.row && m.col === pos.col);
      if (ok){
        state = applyMove(state, selected, pos);
        const canMove = hasLegalMoves(state);
        const inCheck = isInCheck(state.board, state.turn);
        if (!canMove && inCheck){
          status.textContent = state.turn === 'w' ? 'CHECKMATE black won' : 'CHECKMATE white won';
          gameOver = true;
        }
        else if (!canMove && !inCheck){
          status.textContent = 'STALEMATE';
          gameOver = true;
        }
      }
      selected = null;
    }
  }
  draw();
}

function draw(): void{
  renderBoard(state.board, app, handleClick, selected);
  if (!gameOver){
    status.textContent = state.turn === 'w' ? 'White to move' : 'Black to move';
    if (isInCheck(state.board, state.turn)) status.append(" CHECK");
  }
}

draw();