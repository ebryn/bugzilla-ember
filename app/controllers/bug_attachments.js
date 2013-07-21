var Controller = Ember.ArrayController.extend({
  needs: ['user'],
  user: Em.computed.alias('controllers.user')
});

export default Controller;