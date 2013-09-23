var Route = Ember.Route.extend({
  model: function() {
    return this.modelFor('bug');
  },

  controllerName: "bugIndex",

  activate: function() {
    this.controllerFor('bugIndex').set('isEditing', true);
  },

  deactivate: function() {
    this.controllerFor('bugIndex').set('isEditing', false);
  }
});

export default Route;