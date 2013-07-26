import unhandledRejection from 'bugzilla/utils/unhandled_rejection';

var LoginController = Ember.Controller.extend({
  needs: ['user'],

  username: null,
  password: null,
  errorMessage: null,
  
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

    login(username, password).then(function(json) {
      self.send('hideLoginModal');

      self.set('username', null);
      self.set('password', null);

      userController.set('token', json.token || json.Bugzilla_token);
      userController.set('isLoggedIn', true);
    }, function(jqXHR) {
      self.set('errorMessage', 'Invalid username or password');
    }).then(null, unhandledRejection);
  },

  logout: function() {
    this.get('controllers.user').setProperties({
      token: null,
      isLoggedIn: false
    });
  }
});

export default LoginController;
