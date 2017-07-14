import * as model from "nativescript-pentibox/model";

export module rotation {
    export var deg0 = 0;
    export var deg90 = 1;
    export var deg180 = 2;
    export var deg270 = 3;
}

module figures {
    export var one: number = 0;
}

export function newFigure(): model.Figure {
    return new FigureImpl(figures.one);
}

class FigureImpl implements model.Figure {
    public _layout: model.Layout;    
    public _board: model.Board;

    constructor(figureType: number) {
        if(figureType === figures.one) {
            this._layout = new Layout1();
        }
        else {
            throw new Error("Unknown figure type");
        }
    }

    get occupiedCells(): Array<model.Cell> {
        return this._layout.occupiedCells;
    }

    get location(): model.Cell {
        return this._layout.location;
    }

    get rowSpan(): number {
        return this._layout.rowSpan;
    }

    get columnSpan(): number {
        return this._layout.columnSpan;
    }

    public attach(board: model.Board): boolean {
        if(this._board) {
            throw new Error("Figure already attached to a Board");
        }

        this._board = board;
        this._layout.location.column = (this._board.columns - this._layout.columnSpan) / 2;
        this._layout.update();

        return this._layout.canOffset(0, 0, board);
    }

    public moveLeft(): boolean {
        return this.move(0, -1);
    }

    public moveRight(): boolean {
        return this.move(0, 1);
    }

    public moveDown(): boolean {
        return this.move(1, 0);
    }

    public rotate(clockwise?: boolean): boolean {
        if (!this._board) {
            throw new Error("Figure not attached to a board");
        }

        let clockwiseValue = !!clockwise;
        let newAngle = FigureImpl.nextRotationAngle(this._layout.rotationAngle, clockwiseValue);

        if (!this._layout.canRotate(newAngle, this._board)) {
            return false;
        }

        this._layout.rotationAngle = newAngle;
        this._layout.update();

        return true;
    }

    private move(rows: number, columns: number): boolean {
        if (!this._board) {
            throw new Error("Figure not attached to a board");
        }

        if (!this._layout.canOffset(rows, columns, this._board)) {
            return false;
        }

        this._layout.offset(rows, columns);
        return true;
    }

    private static nextRotationAngle(current: number, clockWise: boolean): number {
        let newAngle = clockWise ? current - 1 : current + 1;
        if (newAngle < rotation.deg0) {
            newAngle = rotation.deg270;
        } else if (newAngle > rotation.deg270) {
            newAngle = rotation.deg0;
        }

        return newAngle;
    }
}

class BaseLayout implements model.Layout {
    public location: model.Cell;
    public occupiedCells: Array<model.Cell>;
    public rowSpan: number;
    public columnSpan: number;
    public rotationAngle: number;
    public rotationPattern;
    
    constructor() {
        this.rotationAngle = rotation.deg0;

        this.location = {
            row: 0,
            column: 0 
        };

        this.occupiedCells = new Array<model.Cell>(5);

        // 5 squares per figure
        for (let i = 0; i < 5; i++) {
            this.occupiedCells[i] = {
                row: 0,
                column: 0
            }
        }
    }

    public canOffset(rows: number, columns: number, board: model.Board): boolean {
        // row bounds
        if (this.location.row + rows < 0 || this.location.row + this.rowSpan + rows > board.rows) {
            return false;
        }

        // columns bounds
        if (this.location.column + columns < 0 || this.location.column + this.columnSpan + columns > board.columns) {
            return false;
        }

        // iterate each occupied location, offset it and check availability
        let canOffset = true;
        let currCell: model.Cell;
        
        for(let i = 0; i < this.occupiedCells.length; i++) {
            currCell = this.occupiedCells[i];

            if(board.isOccupied(currCell.row + rows, currCell.column + columns)) {
                canOffset = false;
                break;
            }
        }

        return canOffset;
    }

    public canRotate(angle: number, board: model.Board): boolean {
        let pattern = this.rotationPattern[angle];
        let currArray: Array<number>;

        // check bounds (row & col span)
        currArray = pattern[5];
        let rowSpan = currArray[0];
        let columnSpan = currArray[1];

        // row bounds
        if (this.location.row + rowSpan > board.rows) {
            return false;
        }

        // columns bounds
        if (this.location.column + columnSpan > board.columns) {
            return false;
        }

        let canRotate = true;

        // check for occupied cells
        for(let i = 0; i < 5; i++) {
            currArray = pattern[i];
            let rowIndex = this.location.row + currArray[0];
            let colIndex = this.location.column + currArray[1]; 

            if (board.isOccupied(rowIndex, colIndex)) {
                canRotate = false;
                break;
            }
        }

        return canRotate;
    }

    public offset(rows: number, columns: number) {
        this.location.row += rows;
        this.location.column += columns;

        let currCell: model.Cell;
        for(let i = 0; i < this.occupiedCells.length; i++) {
            currCell = this.occupiedCells[i];
            currCell.row += rows;
            currCell.column += columns;
        }
    }

    public update() {
        let pattern = this.rotationPattern[this.rotationAngle];
        let currCell: model.Cell;
        let currArray: Array<number>;

        for(let i = 0; i < 5; i++) {
            currCell = this.occupiedCells[i];
            currArray = pattern[i];
            currCell.row = this.location.row + currArray[0];
            currCell.column = this.location.column + currArray[1];
        }

        currArray = pattern[5];
        this.rowSpan = currArray[0];
        this.columnSpan = currArray[1];
    }
}

/*
 * This layout looks like:
 * ----
 * Deg0:
 * [][]
 * [][]
 * []
 * ----
 * Deg90:
 * [][]
 * [][][]
 * ----
 * Deg180:
 *   []
 * [][]
 * [][]
 * ----
 * Deg270:
 * [][][]
 *   [][]
*/
class Layout1 extends BaseLayout {
    constructor() {
        super();

        // last array inner element represents the [rowSpan, columnSpan] values 
        this.rotationPattern = [
            [
                [0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [3, 2]
            ],
            [
                [0, 0], [0, 1], [1, 0], [1, 1], [1, 2], [2, 3]
            ],
            [
                [0, 1], [1, 0], [1, 1], [2, 0], [2, 1], [3, 2]
            ],
            [
                [0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [2, 3]
            ]
        ];

        this.rowSpan = 3;
        this.columnSpan = 2;
    }
}