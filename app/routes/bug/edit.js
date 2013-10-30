var Route = Ember.Route.extend({
  model: function() {
    return this.modelFor('bug');
  },

  setupController: Ember.K,

  controllerName: "bug",

  renderTemplate: function() {
    this.render('bug/index');
    this.render('bug/edit_header', {outlet: 'header'});
    this.render('bug/edit_sidebar', {outlet: 'sidebar'});
  },

  activate: function() {
    this.controllerFor('bug').set('isEditing', true);
  },

  deactivate: function() {
    this.controllerFor('bug').set('isEditing', false);
  }
});

export default Route;