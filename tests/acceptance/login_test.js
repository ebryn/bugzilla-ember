var container;
var App = requireModule('bugzilla/app');

module("login", {
  setup: function(){
    App.reset();
    container = App.__container__;
  }
});

test("failed login attempt", function() {
  visit("/").then(function() {
    ok(exists('li a:contains("Login")'), "The login link is visible");
    return click('li a:contains("Login")');
  }).then(function() {
    ok(exists('input[placeholder="Username"]'), "The username field is visible");
    ok(exists('input[placeholder="Password"]'), "The password field is visible");
    return click('button[type="submit"]');
  }).then(function() {
    ok(exists('*:contains("Invalid username or password")'), "An error message is shown when submitting an empty form");
  });
});

test("successful login", function() {
  expect(5);

  var login = function(username, password){
    equal('foo', username);
    equal('bar', password);

    return Ember.RSVP.resolve({ });
  };

  container.stub('action:login', login);

  // we ened a better way to swap out stuff for testing

  visit("/").then(function() {
    stop();

    return new Ember.RSVP.Promise(function(resolve, reject) {
      setTimeout(function(){
        start();
        ok(exists('li a:contains("Login")'), "The login link is visible");
        resolve(click('li a:contains("Login")'));
      }, 100);
    });

  }).then(function() {
    fillIn('input[placeholder="Username"]', 'foo');
    fillIn('input[placeholder="Password"]', 'bar');

    return click('button[type="submit"]');
  }).then(function() {
    ok(!exists('.modal'), "The modal was closed");
    ok(exists('.nav:contains("Logout")'), "Logout link is displayed in the nav bar");
  });
});
