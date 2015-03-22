var sketchList = new Ground.Collection('sketches', { connection: null });
var saveDisabled;
var stage;

if (Meteor.isClient) {
    // This code only runs on the client
    Template.canvas.helpers({
        sketches: function () {
            return sketchList.find();
        }
    });
}

Template.canvas.onRendered(function() {
    newCanvas();
});

Template.canvas.events({
    'click .save': saveSketch,
    'click .thumbnail': clickThumbnail
});

function clickThumbnail(event){
    saveSketch();
    stage.clear();

    //var thumbnail = $(event.target)[0];
    //console.log(thumbnail);
    //var bitmap = new createjs.Shape(thumbnail.attr('src'));

    //stage.addChild(bitmap);
}

function saveSketch(){
    if(saveDisabled) return;

    var canvas = document.getElementById("sketchCanvas");
    var dataUrl = canvas.toDataURL();

    sketchList.insert({url: dataUrl});

    newCanvas();
}

// function to setup a new canvas for drawing
function newCanvas(){
    saveDisabled = true;

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
    title.x = 40;
    title.y = 100;
    stage.addChild(title);

    stage.addChild(drawingCanvas);
    stage.update();

    function handleMouseDown(event) {
        if (!event.primary) { return; }

        if (stage.contains(title)) {
            stage.clear();
            stage.removeChild(title);
            saveDisabled = false;
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