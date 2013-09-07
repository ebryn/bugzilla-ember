var Route = Ember.Route.extend({
  renderTemplate: function() {
    this.render('bugNew2', {
      controller: 'bugEdit'
    });
  },

  setupController: function(controller, model) {
    model = this.modelFor('bug');
    controller.set('model', model);
    controller.set('fields', model.fields);
    controller.set('customFields', model.customFields);
  }
});

export default Route;