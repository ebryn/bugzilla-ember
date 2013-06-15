App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    var bug = App.Bug.find(221820);
    bug.set('id', 221820); // FIXME: why isn't the ID loaded?

    this.transitionTo("bug", bug);
  }
});