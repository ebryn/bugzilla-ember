import ajax from 'bugzilla/utils/ajax';
import urlFor from 'bugzilla/utils/url_for';
import unhandledRejection from 'bugzilla/utils/unhandled_rejection';
import login from 'bugzilla/actions/login';

var LoginController = Ember.Controller.extend({
  needs: ['user'],

  attemptedTransition: null,
  username: null,
  password: null,
  errorMessage: null,

  actions: {
    login: function() {
      var self = this,
          username = this.get('username'),
          password = this.get('password'),
          userController = this.get('controllers.user');

      if (!username || !password) {
        this.set('errorMessage', 'Invalid username or password');

        return;
      }

      login(username, password).then(function(json) {
        self.send('hideLoginModal');

        self.set('username', null);
        self.set('password', null);

        userController.setProperties({
          username: username,
          token: json.token || json.Bugzilla_token,
          isLoggedIn: true
        });

        var attemptedTransition = self.get('attemptedTransition');
        if (attemptedTransition) {
          attemptedTransition.retry();
          self.set('attemptedTransition', null);
        } else {
          self.transitionToRoute('index');
        }
      }, function(jqXHR) {
        self.set('errorMessage', 'Invalid username or password');
      }).then(null, unhandledRejection);
    },

    logout: function() {
      var self = this;

      ajax(urlFor("logout")).then(function() {
        self.get('controllers.user').setProperties({
          token: null,
          isLoggedIn: false
        });

        self.transitionToRoute('login');
      }, function(reason) {
        alert("Error occurred");
        console.log(reason);
      });
    }
  }
});

export default LoginController;
