import 'bugzilla/models/bug' as Bug;

var UserController = Ember.Controller.extend({
  token: function(key, value) {
    if (arguments.length === 2) {
      sessionStorage.token = value;
      return value;
    }
    return sessionStorage.token;
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

    return Bug.find({
      email1: username,
      email1_type: 'equals_any',
      email1_assigned_to: 1
    });
  }.property()
});

export = UserController;
