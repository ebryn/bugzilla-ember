import AuthenticatedRouteMixin from 'bugzilla/routes/authenticated_route_mixin';
import Product from "bugzilla/models/product";

var Route = Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function() {
    return Product.fetch();
  }
});

export default Route;