Template.nav.onRendered(function() {
  var colors = ["#828b20", "#b0ac31", "#cbc53d", "#fad779", "#f9e4ad", "#faf2db", "#563512", "#9b4a0b", "#d36600", "#fe8a00", "#f9a71f"],
      index = 0,
      stage = new createjs.Stage('demoCanvas');
  stage.autoClear = false;
  stage.enableDOMEvents(true);

  createjs.Touch.enable(stage);
  createjs.Ticker.setFPS(24);

  var drawingCanvas = new createjs.Shape();

  stage.addEventListener('stagemousedown', handleMouseDown);
  stage.addEventListener('stagemouseup', handleMouseUp);

  var title = new createjs.Text('Click and Drag to draw', '36px Arial', '#777777');
  title.x = 0;
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
    color = colors[(index++) % colors.length];
    stroke = Math.random() * 30 + 10 | 0;
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
});

var media = {
  maxLength: 10000,  //stop recording after media
  timer: null,
  length: 0,
  paintSweep: 500,
  odometer: 0,
  src: "myrecording.amr"
};

Template.translate.events({
  'click .record_test': record_handler,
  'click .pause_test': pause_handler,
  'click .stop_test': stop_handler,
  'click .play_test': play_handler
});

function play_handler(event) {
  var src = "myrecording.amr";
  var mediaRec = new Media(src,

    // success callback
    function () {
      console.log('playAudio():Audio Success');
    },

    // error callback
    function (err) {
      navigator.notification.alert("playAudio():Audio Error: " + err);
    },

    // status callback
    function(status) {
      media.status = status;
      console.log('*** navanjr *** - status: ' + status);
    }
  );

  media.rec = mediaRec;

  mediaRec.play();

  // Pause after X seconds
  setTimeout(function () {
    mediaRec.stop();
    mediaRec.release();
  }, media.maxLength);
}

function record_handler(event) {
  media.odometer++;
  var mediaRec = new Media(

    media.src,

    // success callback
    function() {
      console.log('*** navanjr ***: recordAudio():Audio Success');
      setStatusText('');
    },

    // error callback
    function(err) {
      navigator.notification.alert("recordAudio():Audio Error: "+ err.code);
    },

    // status callback
    function(status) {
      media.status = status;
      console.log('*** navanjr *** - status: ' + status);
    }
  );

  media.rec = mediaRec;

  console.log('*** navanjr ***: record button pressed: ' + event.target);
  media.length = 0; // reset length
  //event.target.textContent = 'pressed';

  // Record audio
  mediaRec.startRecord();

  // Update my_media position every second
  if (media.timer == null) {
    media.timer = setInterval(function () {

      // bail if we reach media.maxLength
      if(media.length > media.maxLength) {
        mediaRec.stopRecord();
        mediaRec.release();
        media.timer = null;
        return;
      }

      setStatusText(media.length);
      media.length += media.paintSweep;
      //console.log('*** navanjr ***: ' + JSON.stringify(media));
    }, media.paintSweep);
  }
}

function pause_handler(event) {
  if(media.rec && media.status === 3) {
    media.rec.play();
    setStatusText();
  } else if(media.rec) {
    media.rec.pause();
    console.log('Just Paused it.' + media.status);
    setStatusText('paused...');
  }
}

function stop_handler(event) {
  if(media.rec) {
    media.rec.stop();
    media.rec.release();
    setStatusText();
  }
}

function setStatusText(arg) {
  if(typeof(arg) === 'number') {
    $('#media_status').text('recording... ' + arg);
  } else {
    $('#media_status').text(arg || '');
  }
}
