import * as model from "nativescript-pentibox/model";

export function newBoard(rows: number, columns: number): model.Board {
    return new BoardImpl(rows, columns);
}

class BoardImpl implements model.Board {
    private _rows: number;
    private _columns: number;
    private _occupiedCells: {};  

    constructor(rows: number, columns: number) {
        this._rows = rows;
        this._columns = columns;
        this._occupiedCells = {};
    }

    get rows(): number {
        return this._rows;
    }

    get columns(): number {
        return this._columns;
    }
    
    /**
     * Get the occupied cell indices (in the form of rowIndex * columns + columnIndex)
     */
    get occupiedCells(): {} {
        return this._occupiedCells;
    }

    public isOccupied(row: number, column: number) {
        let cellIndex = row * this._columns + column;
        let hasKey = !!(cellIndex in this._occupiedCells);
        return hasKey; 
    }

    public setOccupied(row: number, column: number, occupied: boolean) {
        let cellIndex = row * this._columns + column;
        if (!occupied) {
            delete this._occupiedCells[cellIndex];
        }
        else {
            this._occupiedCells[cellIndex] = true;
        }
    }
}