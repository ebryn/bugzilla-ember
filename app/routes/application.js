var ApplicationRoute = Ember.Route.extend({
  actions: {
    showLoginModal: function() {
      var controller = this.controllerFor('application');

      controller.set('showingLoginModal', true);
    },

    hideLoginModal: function() {
      var controller = this.controllerFor('application');

      controller.set('showingLoginModal', false);
    },

    logout: function() {
      this.controllerFor('login').send('logout');
    },


    error: function(reason, transition) {
      var json = reason.responseJSON;

      if (json && json.code === 410) {
        this.transitionTo('login');
      } else {
        console.assert(false, reason, reason.toString(), reason.stack);
      }
    }
  }
});

export default ApplicationRoute;
