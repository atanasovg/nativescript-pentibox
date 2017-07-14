var createViewModel = require("./main-view-model").createViewModel;
var pentibox = require("nativescript-pentibox/view");
var fps = require("fps-meter");

fps.addCallback(function (fps, minFps) {
    console.info("fps=" + fps + " minFps=" + minFps);
});
fps.start();

var game;

function onNavigatingTo(args) {
    var page = args.object;
    
    var pentiboxGrid = page.getViewById("myGame");
    game = pentiboxGrid.game; 
    game.start();

    setInterval(function() {
        game.onTick();
    }, 500);
    // page.bindingContext = createViewModel();
}
exports.onNavigatingTo = onNavigatingTo;

exports.onLeftTap = function(args) {
    game.moveLeft();
}
exports.onRightTap = function(args) {
    game.moveRight();
}
exports.onRotateCCWTap = function(args) {
    game.rotate();
}
exports.onRotateCWTap = function(args) {
    game.rotate(true);
}