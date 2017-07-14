import * as common from "./grid-common";
import * as color from "color";
import * as model from "nativescript-pentibox/model";
import * as observable from "data/observable";

export class Grid extends common.Grid {
    private _canvas: CanvasView;

    public _createUI(): void {
        this._canvas = new CanvasView(this._context, this.game);
    }

    get android(): android.view.View {
        return this._canvas;
    }

    protected onFigureMoved(data: observable.EventData) {
        super.onFigureMoved(data);

        if(this._canvas) {
            this._canvas.invalidateCurrFigureBounds();
        }
    }

    protected onNewFigure(data: observable.EventData) {
        super.onNewFigure(data);

        if(this._canvas) {
            this._canvas.invalidateCurrFigureBounds();
        }
    }
}

interface Rect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

class CanvasView extends android.view.View {
    private _fill: android.graphics.Paint;
    private _stroke: android.graphics.Paint;
    private _fillColor: color.Color;
    private _strokeColor: color.Color;
    private _game: model.Game;
    private _cellWidth: number;
    private _cellHeight: number;
    private _currFigureRenderBounds: Rect;

    constructor(context: android.content.Context, game: model.Game) {
        super(context);

        this._game = game;

        this._fillColor = new color.Color("#FF555555");
        this._strokeColor = new color.Color("#FF000000");

        this._fill = new android.graphics.Paint();
        this._fill.setStyle(android.graphics.Paint.Style.FILL);
        this._fill.setColor(this._fillColor.android);

        this._stroke = new android.graphics.Paint();
        this._stroke.setStyle(android.graphics.Paint.Style.STROKE);

        return global.__native(this);
    }

    public onDraw(canvas: android.graphics.Canvas) {
        super.onDraw(canvas);

        this._drawCurrentFigure(canvas);
        this._drawOccupiedCells(canvas);
    }

    public onSizeChanged(width: number, height: number, oldWidth: number, oldHeight: number) {
        super.onSizeChanged(width, height, oldWidth, oldHeight);

        let rows = this._game.board.rows;
        let cols = this._game.board.columns;

        this._cellWidth = Math.floor(width / cols);
        this._cellHeight = Math.floor(height / rows);
    }

    public invalidateCurrFigureBounds() {
        this.invalidate();
        // if (!this._currFigureRenderBounds) {
        //     // ensure figure is drawn at least once
        //     return;
        // }

        // let rect = new android.graphics.Rect(
        //     this._currFigureRenderBounds.left, 
        //     this._currFigureRenderBounds.top, 
        //     this._currFigureRenderBounds.right,
        //     this._currFigureRenderBounds.bottom);
        // this.invalidate(rect);
    }

    private _drawCurrentFigure(canvas: android.graphics.Canvas) {
        if (this._game.state !== model.gameState.running) {
            return;
        }

        let figure = this._game.currentFigure;
        let cells = figure.occupiedCells;

        let cell: model.Cell;
        for(let i = 0; i < cells.length; i++) {
            cell = cells[i];
            this._drawCell(canvas, cell);
        }

        let left = figure.location.column * this._cellWidth;
        let top = figure.location.row * this._cellHeight;

        this._currFigureRenderBounds = {
            left: left,
            top: top,
            right: left + figure.columnSpan * this._cellWidth,
            bottom: top + figure.rowSpan * this._cellHeight
        }
    }

    private _drawOccupiedCells(canvas: android.graphics.Canvas) {
        let occupiedCells = this._game.board.occupiedCells;
        for(let i = 0; i < occupiedCells.length; i++) {
            let cell = occupiedCells[i];
            this._drawCell(canvas, cell);
        }
    }

    private _drawCell(canvas: android.graphics.Canvas, cell: model.Cell) {
        canvas.drawRect(
            cell.column * this._cellWidth + 1, 
            cell.row * this._cellHeight,
            cell.column * this._cellWidth + this._cellWidth - 2, 
            cell.row * this._cellHeight + this._cellHeight - 2, 
            this._fill
        );
    }
}