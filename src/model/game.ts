import * as observable from "data/observable";
import * as model from "nativescript-pentibox/model";

export module gameState {
    export var initial = "initial";
    export var running = "running";
    export var paused = "paused";
    export var finished = "finished";
}

export class Game extends observable.Observable {
    public static eventFigureMoved = "figureChanged";
    public static eventLinesCompleted = "linesCompleted";
    public static eventNewFigure = "newFigure";

    private _board: model.Board;
    private _currFigure: model.Figure;
    private _state: string;

    constructor() {
        super();

        this._board = model.newBoard(16, 10);
    }

    get state(): string {
        return this._state;
    }

    get board(): model.Board {
        return this._board;
    }

    get currentFigure(): model.Figure {
        return this._currFigure;
    }

    public start() {
        if (this._state === gameState.running || this._state === gameState.paused) {
            throw new Error("Game already running.");
        }

        this._state = gameState.running;
        this._initNewFigure();
        this.notifyPropertyChange("state", gameState.running);
    }

    public pause() {
        if (this._state !== gameState.running) {
            throw new Error("May not pause a not running game.");
        }

        this._state = gameState.paused;
        this.notifyPropertyChange("state", gameState.paused);
    }

    public resume() {
        if (this._state !== gameState.paused) {
            throw new Error("May not resume a not paused game.");
        }

        this._state = gameState.running;
        this.notifyPropertyChange("state", gameState.running);
    }

    public finish() {
        if (this._state !== gameState.running && this._state !== gameState.paused) {
            throw new Error("May not finish a not running game.");
        }

        this._state = gameState.finished;
        this._reset();
        this.notifyPropertyChange("state", gameState.finished);
    }

    public moveLeft() {
        if(this._state !== gameState.running) {
            return;
        }

        this._move(this._currFigure.moveLeft);
    }

    public moveRight() {
        if(this._state !== gameState.running) {
            return;
        }

        this._move(this._currFigure.moveRight);
    }

    public moveDown() {
        if(this._state !== gameState.running) {
            return;
        }

        this._move(this._currFigure.moveDown);
    }

    public rotate(clockwise?: boolean) {
        if(this._state !== gameState.running) {
            return;
        }

        this._move(this._currFigure.rotate, clockwise);
    }

    public onTick() {
        if(this._state === gameState.paused) {
            // Game is paused, do nothing
            return;
        }

        if (this._state !== gameState.running) {
            throw new Error("Received onTick event for non-running game.");
        }

        if (!this._currFigure) {
            this._initNewFigure();
        }
        else {
            let moved = this._move(this._currFigure.moveDown);
            if (!moved) {
                // current figure may not be moved further, register its current cells as occupied in the game board
                this._setCurrentFigureOccupied();
                this._initNewFigure();
            }
        }
    }

    private _move(action: Function, args?: any): boolean {
        let moved = action.call(this._currFigure, args);
        if(moved) {
            this.notify({
                eventName: Game.eventFigureMoved,
                object: this
            });
        }

        return moved;
    }

    private _setCurrentFigureOccupied() {
        for(let i = 0; i < this._currFigure.occupiedCells.length; i++) {
            let cell = this._currFigure.occupiedCells[i];
            this._board.setOccupied(cell.row, cell.column, true);
        }
    }

    private _checkLines() {
        let completeLines = []; // an array with row indexes that are completed lines
        for(let row = 0; row < this._board.rows; row++) {
            let hasLine = true;
            for (let col = 0; col < this._board.columns; col++) {
                if(!this._board.isOccupied(row, col)) {
                    hasLine = false;
                    break;
                }
            }

            if (hasLine) {
                completeLines.push(row);
            }
        }

        if (completeLines.length > 0) {
            // shift the occupied cells down by lines count
            this.notify({
                eventName: Game.eventLinesCompleted,
                lines: completeLines,
                object: this
            })
        }
    }

    private _reset() {
        // TODO: implement
    }

    private _initNewFigure() {
        this._currFigure = model.newFigure();
        let attached = this._currFigure.attach(this._board);
        if(attached) {
            this.notify({
                eventName: Game.eventNewFigure,
                object: this
            });
        }

        if (!attached) {
            this.finish();
        }
    }
}