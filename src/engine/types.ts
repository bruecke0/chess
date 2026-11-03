export type Color = 'w' | 'b';

export type PieceType = 'p'|'n'|'b'|'r'|'q'|'k';

export type Piece = {color: Color; type: PieceType};

export type Square = Piece | null;

export type Board = Square[][];

export type Position = {
    row: number;
    col: number;
};

export type CastlingRights = {
    wK: Boolean;
    wQ: Boolean;
    bK: Boolean;
    bQ: Boolean;
}

export type GameState = {
    board: Board; 
    turn: Color; 
    castling: CastlingRights; 
    enPassant: Position | null;
    halfmoveClock: number;
}