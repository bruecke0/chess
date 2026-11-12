import './style.css'
import { getPiece } from "./engine/board";
import { renderBoard, renderPromotion } from "./ui/render";
import type { PieceType, Position } from './engine/types';
import { getLegalMoves, hasLegalMoves, isInCheck } from './engine/check';
import { applyMove, createInitialState } from './engine/game';
import { isInsufficientMaterial } from './engine/draw';

const app = document.getElementById('app')!;
const status = document.getElementById('status')!;
const restartBtn = document.getElementById('restart')!;
const promotionE1 = document.getElementById('promotion')!;

let selected: Position | null = null;
let pendingPromotion: { from: Position; to: Position } | null = null;
let lastMove: { from: Position; to: Position } | null = null;
let gameOver = false;

let state = createInitialState();

function restart(): void{
  state = createInitialState();
  selected = null;
  gameOver = false;
  pendingPromotion = null;
  lastMove = null;
  draw();
}

function playMove(from: Position, to: Position, promotion?: PieceType): void{
  state = applyMove(state, from, to, promotion);
  lastMove = { from, to };
  const insufficientMaterial = isInsufficientMaterial(state.board);
  if (insufficientMaterial){
    status.textContent = 'DRAW: insufficient material';
    gameOver = true;
  }
  if (state.halfmoveClock >= 100){
    gameOver = true;
    status.textContent = 'DRAW: 50-move rule';
  }
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

function handleClick(pos: Position): void {
  if (pendingPromotion !== null) return;
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
        const piece = getPiece(state.board, selected);
        const isPromotion = (
          piece !== null && piece.type === 'p' && pos.row === (piece.color === 'w' ? 0 : 7));
        if (isPromotion) {
          pendingPromotion = { from: selected, to: pos };
        } else {
          playMove(selected, pos);
        }
      }
      selected = null;
    }
  }
  draw();
}

restartBtn.addEventListener('click', restart);

function choosePromotion(type: PieceType): void{
  if (pendingPromotion === null) return;
  playMove(pendingPromotion.from, pendingPromotion.to, type);
  pendingPromotion = null;
  selected = null;
  draw();
}

function draw(): void{
  let targets: Position[] = [];
  if (selected !== null && !gameOver){
    targets = getLegalMoves(state, selected);
  }
  renderBoard(state.board, app, handleClick, selected, targets, lastMove);
  if (!gameOver){
    status.textContent = state.turn === 'w' ? 'White to move' : 'Black to move';
    if (isInCheck(state.board, state.turn)) status.append(" CHECK");
  }
  if (pendingPromotion !== null){
    renderPromotion(promotionE1, state.turn, choosePromotion);
  } else {
    promotionE1.innerHTML = '';
  }
}

draw();