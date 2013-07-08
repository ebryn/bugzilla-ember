import 'bugzilla/models/bug' as Bug;

// TODO: remove app dependency
import 'bugzilla/app' as App;

var IndexRoute = Ember.Route.extend({
  redirect: function() {
    var id = App.USE_TEST_SERVER ? 1 : 856410,
        bug = Bug.find(id);
    bug.set('id', id); // FIXME: why isn't the ID loaded?

    this.transitionTo("bug", bug);
  }
});

export = IndexRoute;
