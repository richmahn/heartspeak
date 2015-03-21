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

Template.nate.events({
  'click .record_test': function(event) {
    console.log('*** navanjr ***: record button pressed: ' + event.target);
    event.target.textContent = 'pressed';

    function setAudioPosition(position) {
      //document.getElementById('audio_position').innerHTML = position;
      event.target.textContent = 'recording... ' + position;
    }

    document.addEventListener('deviceready', function() {
      var src = "myrecording.amr";
      var recordingStatus;
      var mediaRec = new Media(src,
        // success callback
        function() {
          navigator.notification.alert("recordAudio():Audio Success");
        },

        // error callback
        function(err) {
          navigator.notification.alert("recordAudio():Audio Error: "+ err.code);
        },

        function(status) {
          console.log('*** navanjr ***: ' + status);
          //if([0,4].contains(status)) {
          //  navigator.notification.alert('Ready to record?');
          //
          //  //event.target.textContent = 'recording';
          //} else {
          //  console.log('*** navanjr *** else: ' + status);
          //  //event.target.textContent = 'start';
          //}
        }
      );

      // Record audio
      mediaRec.startRecord();
      // Stop recording after 10 seconds
      setTimeout(function() {
        mediaRec.stopRecord();
      }, 10000);

      var mediaTimer = null;

      // Update my_media position every second
      if (mediaTimer == null) {
        mediaTimer = setInterval(function () {
          // get my_media position
          mediaRec.getDuration(
            // success callback
            function (position) {
              if (position > -1) {
                setAudioPosition((position) + " sec");
              }
            },
            // error callback
            function (e) {
              console.log("Error getting position: " + e);
              setAudioPosition("Error: " + e);
            }
          );
        }, 500);
      }

    }, false);
  },
  'click .play_test': function(event) {
    var src = "myrecording.amr";
    var mediaRec = new Media(src,
      // success callback
      function () {
        navigator.notification.alert("playAudio():Audio Success");
      },

      // error callback
      function (err) {
        navigator.notification.alert("playAudio():Audio Error: " + err);
      });

      mediaRec.play();

      // Pause after 10 seconds
      setTimeout(function () {
        mediaRec.pause();
      }, 5000);
  }
});
