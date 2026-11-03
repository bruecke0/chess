import { getPiece } from "./board";
import type { Board, PieceType } from "./types";

export function isInsufficientMaterial(board: Board): boolean{
    const material: PieceType[] = [];
    for (let row = 0; row < 8; row++){
        for (let col = 0; col < 8; col++){
            const piece = getPiece(board, {row, col});
            if (piece === null || piece.type === 'k'){
                continue;
            }
            material.push(piece.type); 
        }
    }
    if (material.length === 0){
        return true;
    } else if (material.length === 1 && (material.includes('n') || material.includes('b'))){
        return true;
    }
    return false;
}