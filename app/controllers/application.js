var ApplicationController = Ember.Controller.extend({
  needs: ['user', 'login'],
  user: Ember.computed.alias('controllers.user'),
});

export default ApplicationController;
