import Bug from 'bugzilla/models/bug';

var UserController = Ember.Controller.extend({
  username: function(key, value) {
    if (arguments.length === 2) {
      if (value === null) {
        delete localStorage.username;
      } else {
        localStorage.username = value;
      }
      return value;
    }
    return localStorage.username;
  }.property(),

  token: function(key, value) {
    if (arguments.length === 2) {
      if (value === null) {
        delete localStorage.token;
      } else {
        localStorage.token = value;
      }
      return value;
    }
    return localStorage.token;
  }.property(),

  isLoggedIn: function(key, value) {
    if (arguments.length === 2) { return value; }
    return !!this.get('token');
  }.property('token'),

  bugs: function() {
    var username = this.get('username'),
        isLoggedIn = this.get('isLoggedIn');

    if (!isLoggedIn) {
      return Ember.RSVP.resolve([]);
    }

    return Bug.findQuery({
      email1: username,
      email1_type: 'equals_any',
      email1_assigned_to: 1
    });
  }.property(),

  willDestroy: function() {
    delete localStorage.token;
  }
});

export default UserController;
