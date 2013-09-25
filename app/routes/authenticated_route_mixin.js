var AuthenticatedRouteMixin = {
  beforeModel: function(transition) {
    if (!this.controllerFor('user').get('isLoggedIn')) {
      var loginController = this.controllerFor('login');
      loginController.set('attemptedTransition', transition);

      this.transitionTo('login');
    }
  }
};

export default AuthenticatedRouteMixin;