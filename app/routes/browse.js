import Product from 'bugzilla/models/product';

var BrowseRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    controller.set('products', Product.find());
  }
});

export default BrowseRoute;
