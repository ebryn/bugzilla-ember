import Bug from 'bugzilla/models/bug';
import Product from 'bugzilla/models/product';

var Route = Ember.Route.extend({
  setupController: function(controller, model) {
    controller.set('content', Bug.create());
    controller.set('products', Product.find());
  }
});

export default Route;