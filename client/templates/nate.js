Template.nate.events({
  'click .record_test': function(event) {
    navigator.notification.alert('tapped');
    document.addEventListener('deviceready', function() {
      var src = "myrecording.amr";
      var mediaRec = new Media(src,
        // success callback
        function() {
          navigator.notification.alert("recordAudio():Audio Success");
        },

        // error callback
        function(err) {
          navigator.notification.alert("recordAudio():Audio Error: "+ err.code);
        });

      // Record audio
      mediaRec.startRecord();

      // Stop recording after 10 seconds
      setTimeout(function() {
          mediaRec.stopRecord();
      }, 5000);
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
