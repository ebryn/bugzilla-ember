import 'bugzilla/models/bug' as Bug;

var BrowseRoute = Ember.Route.extend({
  model: function(params) {
    return Bug.find({
      product: 'Core',
      component: 'DOM: Core & HTML',
      changed_after: '24h'
    });
  }
});

export = BrowseRoute;
