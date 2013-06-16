App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    var bug = App.Bug.find(856410);
    bug.set('id', 856410); // FIXME: why isn't the ID loaded?

    this.transitionTo("bug", bug);
  }
});
