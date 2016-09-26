import * as view from "ui/core/view";
import * as model from "nativescript-pentibox/model";
import * as definition from "nativescript-pentibox/view";
import * as DO from "ui/core/dependency-observable";
import * as observable from "data/observable";
import * as enums from "ui/enums";

export class Grid extends view.View implements definition.Grid {
    private _game: model.Game;
    private _cellSize: number;

    public static cellSizeProperty = new DO.Property("cellSize", "PentiboxGrid",
        new DO.PropertyMetadata(20, DO.PropertyMetadataSettings.AffectsLayout, Grid._onCellSizePropertyChanged));

    constructor() {
        super();

        this.horizontalAlignment = enums.HorizontalAlignment.stretch; 
        this.verticalAlignment = enums.VerticalAlignment.stretch;

        this._game = new model.Game();
        this._game.on(model.Game.eventFigureMoved, this.onFigureMoved, this);
    }

    public get game(): model.Game {
        return this._game;
    }

    get cellSize(): number {
        return this._getValue(Grid.cellSizeProperty);
    }
    set cellSize(value: number) {
        this._setValue(Grid.cellSizeProperty, value);
    }

    private static _onCellSizePropertyChanged(data: DO.PropertyChangeData): void {
    }

    protected onFigureMoved(data: observable.EventData) {

    }
}