var BugRoute = Ember.Route.extend({
  controllerName: 'bug',

  model: function(params) {
    return this.modelFor('bug');
  },

  activate: function() {
    this.controllerFor('bug.index')._startPolling();
  },

  deactivate: function() {
    this.controllerFor('bug.index')._stopPolling();
  }
});

export default BugRoute;
