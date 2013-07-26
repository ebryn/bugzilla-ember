var Route = Ember.Route.extend({
  renderTemplate: function() {
    this.render('bugNew', {
      controller: 'bugEdit'
    });
  },

  setupController: function(controller, model) {
    controller.set('model', this.modelFor('bug'));
    controller.set('products', this.find('product'));
  }
});

export default Route;