import 'bugzilla/models/bug' as Bug;

var BugRoute = Ember.Route.extend({
  model: function(params) {
    return Bug.find(params.bug_id);
  }
});

export = BugRoute;
