Template.canvas.onRendered(function() {
    newCanvas();
});

Template.canvas.events({
    'click .save': function() {
        var canvas = document.getElementById("sketchCanvas");
        localStorage.setItem('sketch', canvas.toDataURL());
        alert('saved to local storage');

        newCanvas();
    }
});

// function to setup a new canvas for drawing
function newCanvas(){
    var index = 0,
        stage = new createjs.Stage('sketchCanvas');
    stage.clear();
    stage.autoClear = false;
    stage.enableDOMEvents(true);

    createjs.Touch.enable(stage);
    createjs.Ticker.setFPS(24);

    var drawingCanvas = new createjs.Shape();

    stage.addEventListener('stagemousedown', handleMouseDown);
    stage.addEventListener('stagemouseup', handleMouseUp);

    var title = new createjs.Text('Sketch your ♥ out!', '36px Arial', '#777777');
    title.x = 20;
    title.y = 100;
    stage.addChild(title);

    stage.addChild(drawingCanvas);
    stage.update();

    function handleMouseDown(event) {
        if (!event.primary) { return; }
        if (stage.contains(title)) {
            stage.clear();
            stage.removeChild(title);
        }
        color = "#000";
        stroke = 10;
        oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
        oldMidPt = oldPt.clone();
        stage.addEventListener('stagemousemove', handleMouseMove);
    }

    function handleMouseMove(event) {
        if (!event.primary) { return; }
        var midPt = new createjs.Point(oldPt.x + stage.mouseX >> 1, oldPt.y + stage.mouseY >> 1);

        drawingCanvas.graphics.clear()
            .setStrokeStyle(stroke, 'round', 'round')
            .beginStroke(color)
            .moveTo(midPt.x, midPt.y)
            .curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

        oldPt.x = stage.mouseX;
        oldPt.y = stage.mouseY;

        oldMidPt.x = midPt.x;
        oldMidPt.y = midPt.y;

        stage.update();
    }

    function handleMouseUp(event) {
        if (!event.primary) { return; }
        stage.removeEventListener('stagemousemove', handleMouseMove);
    }
}