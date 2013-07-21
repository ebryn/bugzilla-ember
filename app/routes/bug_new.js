var Route = Ember.Route.extend({
  setupController: function(controller, model) {
    controller.set('content', this.create('bug'));
    controller.set('products', this.find('product'));
  }
});

export default Route;
