var container;

module("dashboard", {
  setup: function() {
    App.reset();

    container = App.__container__;
  }
});

function login() {
  var userController = container.lookup('controller:user');

  Ember.run(userController, 'set', 'isLoggedIn', true);
}

function currentPath() {
  return App.__container__.lookup('router:main').get('location.path');
}

test("dashboard link is not visible if the user is not logged in", function(){
  visit('/').then(function(){
    ok(!exists('a:contains("My Dashboard")'), 'my dashboard link is not visible');
  });

});

test("dashboard link is visible if the user is logged in", function(){
  login();
  visit('/').then(function(){
    stop();

    // redirect + transition with async thenable doesn't seem to hold visit (yet)
    setTimeout(function(){
      start();
      ok(exists('a:contains("My Dashboard")'), 'my dashboard link is visible');
    }, 100);
  });
});

test("visit /dashboard, when NOT logged in, redirects", function(){
  visit('/dashboard').then(function(){
    ok(currentPath() !== '/dashboard', 'redirected from dashboard');
  });
});

test("visit to your dashboard, when logged in", function(){
  login();

  visit('/dashboard').then(function(){
    equal(currentPath(), '/dashboard', 'at the current url');

    ok(exists("h1:contains('My Dashboard')"), 'My Dashboard text is present');
  });
});

test("navigate to the dashboard, when logged in.", function(){
  login();

  visit('/').then(function(){
    stop();
    // temp workaround until we sort out router level transitions & ember-testing
    return Ember.RSVP.Promise(function(resolve){
      setTimeout(function(){
        start();
        resolve(click('a:contains("My Dashboard")'));
      }, 100);
    });
  }).then(function(){
    equal(currentPath(), '/dashboard', 'url is correct');
  });
});

test("given the current user has 4 bugs assigned to them, they should appear on there dashboard", function(){
  login();

  var controller = container.lookup('controller:user');

  controller.set('bugs', [
    mockBug(),
    mockBug(),
    mockBug(),
    mockBug()
  ]);

  visit('/dashboard').then(function(){
    equal(currentPath(), '/dashboard', 'at the current url');
    equal(find('.my-bugs .bug').length, 4, 'there are 4 issues');
  });
});
