App.BugRoute = Ember.Route.extend({
  model: function(params) {
    return App.Bug.find(params.bug_id);
  }
});