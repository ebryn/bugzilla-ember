import Bug from 'bugzilla/models/bug';

var BugRoute = Ember.Route.extend({
  model: function(params) {
    return this.modelFor('bug');
  }
});

export default BugRoute;
