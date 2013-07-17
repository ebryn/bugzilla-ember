import 'bugzilla/models/bug' as Bug;

var BugRoute = Ember.Route.extend({
  model: function(params) {
    return this.modelFor('bug');
  }
});

export = BugRoute;
