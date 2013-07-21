import Product from 'bugzilla/models/product';

var BrowseRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    controller.set('products', this.find('product'));
  }
});

export default BrowseRoute;
