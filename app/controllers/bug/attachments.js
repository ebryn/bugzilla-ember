var Controller = Ember.ArrayController.extend({
  needs: ['user', 'bug'],
  user: Em.computed.alias('controllers.user'),
  bug:  Em.computed.alias('controllers.bug')
});

export default Controller;
