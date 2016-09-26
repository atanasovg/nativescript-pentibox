declare module "nativescript-pentibox/view" {
    import * as view from "ui/core/view";
    import * as model from "nativescript-pentibox/model";
    import * as DO from "ui/core/dependency-observable";

    class Grid extends view.View {
        game: model.Game;
    } 
}