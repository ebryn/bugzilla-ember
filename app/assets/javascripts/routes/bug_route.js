App.BugRoute = Ember.Route.extend({
  model: function(params) {
    return App.Bug.find(params.bug_id);
  },

  events: {
    loadBug: function(bug_id) {
      var bug = App.Bug.find(bug_id+''); // FIXME: coercion shouldn't be required
      bug.set('id', bug_id+''); // FIXME: why isn't the ID loaded?
      
      this.transitionTo("bug", bug);
    }
  }
});