Meteor.startup(function() {
  // Potentially prompts the user to enable location services. We do this early
  // on in order to have the most accurate location by the time the user shares
  Geolocation.currentLocation();
  SketchList = new Ground.Collection('sketches', { connection: null });
  Scripture = new Ground.Collection('scripture', { connection: null });
});
