var BugRoute = Ember.Route.extend({
  controllerName: 'bug',

  model: function() {},
  setupController: Ember.K,

  activate: function() {
    this.controllerFor('bug.index')._startPolling();
  },

  deactivate: function() {
    this.controllerFor('bug.index')._stopPolling();
  }
});

export default BugRoute;
