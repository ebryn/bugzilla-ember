App.DashboardRoute = Ember.Route.extend({
  redirect: function(){
    var user = this.controllerFor('user'),
        isLoggedIn = user.get('isLoggedIn');

    if (!isLoggedIn) {
      this.transitionTo('index');
    }
  }
});
