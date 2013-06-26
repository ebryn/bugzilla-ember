App.BrowseRoute = Ember.Route.extend({
  model: function(params) {
    return App.Bug.find({
      product: 'Core',
      component: 'DOM: Core & HTML',
      changed_after: '24h'
    });
  }
});
