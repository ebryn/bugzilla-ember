// FIXME: This is kinda hacky. We have a plan for making this cleaner with the container.
import 'bugzilla/app' as App;

function urlFor(url) {
  var container = App.__container__,
      userController = container.lookup("controller:user"),
      isLoggedIn = userController.get('isLoggedIn'),
      authParams = $.param({Bugzilla_token: userController.get('token')});

  var fullURL = (App.USE_TEST_SERVER ? "http://staging.bugzilla.erikbryn.com/rest.cgi/" : "https://bugzilla-dev.allizom.org/rest/") + url;

  if (isLoggedIn) {
    fullURL += (url.indexOf("?") === -1 ? "?" : "&" ) + authParams;
  }

  return fullURL;
}

export = urlFor;
