App.login = function(username, password){
  var params =  {
    username: username,
    password: password
  };

  return App.getJSON("https://api-dev.bugzilla.mozilla.org/latest/user/persona@erikbryn.com", params);
};

App.LoginController = Ember.Controller.extend({
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

    App.login(username, password).then(function(data) {
      self.send('hideLoginModal');

      self.set('username', null);
      self.set('password', null);

      userController.set('username', username);
      userController.set('password', password);
      userController.set('isLoggedIn', true);

    }, function(jqXHR) {
      self.set('errorMessage', 'Invalid username or password');
    });
  }
});
