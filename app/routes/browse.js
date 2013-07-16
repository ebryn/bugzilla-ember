import 'bugzilla/models/product' as Product;

var BrowseRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    controller.set('products', Product.find());
  }
});

export = BrowseRoute;
