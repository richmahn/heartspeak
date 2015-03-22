var feedSubscription;

// Handle for launch screen possibly dismissed from app-body.js
dataReadyHold = null;

// Global subscriptions
if (Meteor.isClient) {
  Meteor.subscribe('news');
  Meteor.subscribe('bookmarkCounts');
  feedSubscription = Meteor.subscribe('feed');
}

Router.configure({
  layoutTemplate: 'appBody',
  notFoundTemplate: 'notFound'
});

if (Meteor.isClient) {
  // Keep showing the launch screen on mobile devices until we have loaded
  // the app's data
  dataReadyHold = LaunchScreen.hold();
}

HomeController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('latestActivity', function() {
      dataReadyHold.release();
    });
  }
});

FeedController = RouteController.extend({
  onBeforeAction: function() {
    this.feedSubscription = feedSubscription;
  }
});

RecipesController = RouteController.extend({
  data: function() {
    return _.values(RecipesData);
  }
});

BookmarksController = RouteController.extend({
  onBeforeAction: function() {
    if (Meteor.user())
      Meteor.subscribe('bookmarks');
    else
      Overlay.open('authOverlay');
  },
  data: function() {
    if (Meteor.user())
      return _.values(_.pick(RecipesData, Meteor.user().bookmarkedRecipeNames));
  }
});

RecipeController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('recipe', this.params.name);
  },
  data: function() {
    return RecipesData[this.params.name];
  }
});

CanvasController = RouteController.extend({
  onBeforeAction: function() {
    console.log(this.params.chunkSeed);
    Meteor.subscribe('chunkSeed', this.params.chunkSeed);
  },
  data: function() {
    return this.params.chunkSeed;
  }
});

TranslateController = RouteController.extend({
  onBeforeAction: function() {
    console.log(this.params.chunkSeed);
    Meteor.subscribe('chunkSeed', this.params.chunkSeed);
  },
  data: function() {
    return this.params.chunkSeed;
  }
});

AdminController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('news');
  }
});

Router.map(function() {
  this.route('book-selection', {path: '/'});
  this.route('home');
  this.route('feed');
  this.route('recipes');
  this.route('bookmarks');
  this.route('about');
  
  this.route('translate', {path: '/translate/:chunkSeed'});
  this.route('recipe', {path: '/recipes/:name'});
  this.route('admin', { layoutTemplate: null });
  
  this.route('canvas', {path: '/canvas/:chunkSeed'});
    this.route('sandbox');
    this.route('browse');

});

Router.onBeforeAction('dataNotFound', {only: 'recipe'});
