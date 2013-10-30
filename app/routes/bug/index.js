var BugRoute = Ember.Route.extend({
  controllerName: 'bug',

  model: function() {},
  setupController: Ember.K,

  renderTemplate: function() {
    this.render('bug/index');
    this.render('bug/index_header', {outlet: 'header'});
    this.render('bug/index_sidebar', {outlet: 'sidebar'});
  },

  activate: function() {
    this.controllerFor('bug.index')._startPolling();
  },

  deactivate: function() {
    this.controllerFor('bug.index')._stopPolling();
  }
});

export default BugRoute;
