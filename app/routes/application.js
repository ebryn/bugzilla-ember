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
      this.controllerFor('login').logout();
    }
  }
});

export default ApplicationRoute;
