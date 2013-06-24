import 'bugzilla/models/bug' as Bug;

var IndexRoute = Ember.Route.extend({
  redirect: function() {
    var bug = Bug.find(856410);
    bug.set('id', 856410); // FIXME: why isn't the ID loaded?

    this.transitionTo("bug", bug);
  }
});

export = IndexRoute;
