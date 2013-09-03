var Route = Ember.Route.extend({
  renderTemplate: function() {
    this.render('bugNew', {
      controller: 'bugEdit'
    });
  },

  setupController: function(controller, model) {
    model = this.modelFor('bug');
    controller.set('model', model);
    controller.set('fields', model.fields);
    // controller.set('products', this.find('product'));
  }
});

export default Route;