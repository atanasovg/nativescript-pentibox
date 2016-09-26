import * as observable from "data/observable";
import * as model from "nativescript-pentibox/model";

export class Game extends observable.Observable {
    public static eventFigureMoved = "figureChanged";
    public static eventLinesCompleted = "linesCompleted";

    private _board: model.Board;
    private _currFigure: model.Figure;
    private _running: boolean;
    private _finished: boolean;

    constructor() {
        super();

        this._board = model.newBoard(16, 10);
    }

    get board(): model.Board {
        return this._board;
    }

    get currentFigure(): model.Figure {
        return this._currFigure;
    }

    public start() {
        if (this._running) {
            throw new Error("Game already running");
        }

        this._running = true;
        this._finished = false;
        this._initNewFigure();
    }

    public onTick() {
        this._verifyRunning();

        if (!this._currFigure) {
            this._initNewFigure();
        }
        else {
            let moved = this.move(this._currFigure.moveDown);
            if (!moved) {

            }
        }
    }

    private move(action: Function): boolean {
        let moved = action.apply(this._currFigure);
        if(moved) {
            this.notify({
                eventName: Game.eventFigureMoved,
                object: this
            });
        }

        return moved;
    }

    private _verifyRunning() {
        if (!this._running) {
            throw new Error("Game is not running"); 
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

    private _initNewFigure() {
        this._currFigure = model.newFigure();
        this._currFigure.attach(this._board);
    }
}