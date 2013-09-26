var Route = Ember.Route.extend({
  model: function() {
    return this.modelFor('bug');
  },

  setupController: Ember.K,

  controllerName: "bug",

  activate: function() {
    this.controllerFor('bug').set('isEditing', true);
  },

  deactivate: function() {
    this.controllerFor('bug').set('isEditing', false);
  }
});

export default Route;