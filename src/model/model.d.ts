declare module "nativescript-pentibox/model" {
    import * as observable from "data/observable";

    interface Cell {
        row: number;
        column: number;
    }

    interface Board {
        rows: number;
        columns: number;
        occupiedCells: Array<Cell>;
        isOccupied(row: number, column: number): boolean;
        setOccupied(row: number, column: number, occupied: boolean);
    }

    interface Figure {
        location: Cell;
        occupiedCells: Array<Cell>;
        rowSpan: number;
        columnSpan: number;
        attach(board: Board): boolean; // false if the figure spawns on already occupied cells (game over) 
        moveLeft(): boolean;
        moveRight(): boolean;
        moveDown(): boolean;
        rotate(clockwise?: boolean): boolean;
    }

    interface LinesCompletedEventData extends observable.EventData {
        lines: Array<number>;
    }

    function newBoard(rows: number, columns: number): Board;
    function newFigure(): Figure;

    interface Layout {
        location: Cell; // the top-left cell of the square that completely encloses the figure
        occupiedCells: Array<Cell>;
        rowSpan: number;
        columnSpan: number;
        rotationAngle: number;

        offset(rows: number, columns: number);
        update();
        canOffset(rows: number, columns: number, board: Board): boolean;
        canRotate(angle: number, board: Board): boolean;
    }

    module rotation {
        export var deg0;
        export var deg90;
        export var deg180;
        export var deg270;
    }

    export class Game extends observable.Observable {
        static eventFigureMoved: string;
        static eventNewFigure: string;
        board: Board;
        currentFigure: Figure;
        state: string;
        start(): void;
        finish(): void;
        pause(): void;
        onTick(): void;
        // figure methods
        moveLeft(): void;
        moveRight(): void;
        moveDown(): void;
        rotate(clockwise?: boolean): void;
    }

    module gameState {
        export var initial: string;
        export var running: string;
        export var paused: string;
        export var stopped: string;
    }
}