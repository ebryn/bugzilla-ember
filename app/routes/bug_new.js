import Product from "bugzilla/models/product";

var Route = Ember.Route.extend({
  model: function() {
    return Product.fetch();
  }
});

export default Route;