var originalLogin;

module("login", {
  setup: function(){
    originalLogin = App.login;
    App.reset();
  },
  teardown: function(){
    App.login = originalLogin;
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

  App.login = function(username, password){
    equal('foo', username);
    equal('bar', password);

    return Ember.RSVP.resolve({ });
  };

  visit("/").then(function() {
    ok(exists('li a:contains("Login")'), "The login link is visible");
    return click('li a:contains("Login")');
  }).then(function() {
    fillIn('input[placeholder="Username"]', 'foo');
    fillIn('input[placeholder="Password"]', 'bar');

    return click('button[type="submit"]');
  }).then(function() {
    ok(!exists('.modal'), "The modal was closed");
    ok(exists('.nav:contains("foo")'), "Username is displayed in the nav bar");
  });
});
