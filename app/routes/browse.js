import AuthenticatedRouteMixin from 'bugzilla/routes/authenticated_route_mixin';
import Product from 'bugzilla/models/product';

var BrowseRoute = Ember.Route.extend(AuthenticatedRouteMixin, {
  setupController: function(controller, model) {
    controller.set('products', Product.find({include_fields: 'id, name, components.name'}));
  }
});

export default BrowseRoute;
