var IndexRoute = Ember.Route.extend({
  redirect: function() {
    var id = this.get('config.defaultBugId');
    this.transitionTo("bug", id);
  }
});

export default IndexRoute;
