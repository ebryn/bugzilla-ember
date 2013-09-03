var Config = Ember.Object.extend({
  // host: "http://staging.bugzilla.erikbryn.com",
  // path: '/rest.cgi/',
  // defaultBugId: 1
  host: "https://bugzilla-dev.allizom.org",
  path: '/rest/',
  defaultBugId: 432984
});

Ember.Application.initializer({
  name: "config",
  initialize: function(container, application) {
    application.register('config:main', Config);
    application.inject('route', 'config', 'config:main');
    application.inject('controller', 'config', 'config:main');
  }
});

export default Config;
