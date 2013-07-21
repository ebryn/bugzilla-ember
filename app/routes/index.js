var IndexRoute = Ember.Route.extend({
  redirect: function() {
    var id = this.get('config.defaultBugId');
    var bug = this.find('bug', id);

    bug.set('id', id); // FIXME: why isn't the ID loaded?
    this.transitionTo("bug", bug);
  }
});

export default IndexRoute;
