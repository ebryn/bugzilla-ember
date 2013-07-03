import 'bugzilla/models/bug' as Bug;

var IndexRoute = Ember.Route.extend({
  redirect: function() {
    var id = App.USE_TEST_SERVER ? 11736 : 856410,
        bug = Bug.find(id);
    bug.set('id', id); // FIXME: why isn't the ID loaded?

    this.transitionTo("bug", bug);
  }
});

export = IndexRoute;
