import 'bugzilla/utils/unhandled_rejection' as unhandledRejection;

var LoginController = Ember.Controller.extend({
  needs: ['user'],
  login: function() {
    var self = this,
        username = this.get('username'),
        password = this.get('password'),
        userController = this.get('controllers.user');

    if (!username || !password) {
      this.set('errorMessage', 'Invalid username or password');

      return;
    }

    // this.actionFor
    var login = this.container.lookup('action:login');

    login(username, password).then(function(data) {
      self.send('hideLoginModal');

      self.set('username', null);
      self.set('password', null);

      userController.set('username', username);
      userController.set('password', password);
      userController.set('isLoggedIn', true);

    }, function(jqXHR) {
      self.set('errorMessage', 'Invalid username or password');
    }).then(null, unhandledRejection);
  }
});

export = LoginController;
