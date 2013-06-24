import 'bugzilla/models/bug' as Bug;

var UserController = Ember.Controller.extend({
  username: null,
  password: null,
  isLoggedIn: false,

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
