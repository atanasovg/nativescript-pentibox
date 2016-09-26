var createViewModel = require("./main-view-model").createViewModel;
var pentibox = require("nativescript-pentibox/view");
var fps = require("fps-meter");

fps.addCallback(function (fps, minFps) {
    console.info("fps=" + fps + " minFps=" + minFps);
});
fps.start();

function onNavigatingTo(args) {
    var page = args.object;
    
    var grid = new pentibox.Grid();

    var gridLayout = page.getViewById("myLayout");
    gridLayout.addChild(grid);

    grid.game.start();

    setInterval(function() {
        grid.game.onTick();
    }, 17);
    // page.bindingContext = createViewModel();
}
exports.onNavigatingTo = onNavigatingTo;