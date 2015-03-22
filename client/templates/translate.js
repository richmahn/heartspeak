var sketchList = new Ground.Collection('sketches', { connection: null });

if (Meteor.isClient) {
    // This code only runs on the client
    Template.translate.helpers({
        sketches: function () {
            return sketchList.find();
        }
    });
}

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
