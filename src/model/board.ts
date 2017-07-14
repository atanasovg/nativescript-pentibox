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
     * Get the currently occupied cells
     */
    get occupiedCells(): Array<model.Cell> {
        let occupied = this._occupiedCells;
        let keys = Object.keys(occupied);
        let result = new Array<model.Cell>(keys.length);
        for(let i = 0; i < keys.length; i++) {
            let index = occupied[keys[i]];
            let colIndex = index % this._columns;
            let rowIndex = (index - colIndex) / this._columns;
            result[i] = { row: rowIndex, column: colIndex };
        }

        return result;
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
            this._occupiedCells[cellIndex] = cellIndex;
        }
    }
}