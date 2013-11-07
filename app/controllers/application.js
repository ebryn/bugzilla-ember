var ApplicationController = Ember.Controller.extend({
  needs: ['user', 'login'],
  user: Ember.computed.alias('controllers.user'),

  recentBugs: function() {
    return [];
  }.property()
});

export default ApplicationController;
