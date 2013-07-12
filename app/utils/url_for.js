// FIXME: This is kinda hacky. We have a plan for making this cleaner with the container.
import 'bugzilla/app' as App;

function urlFor(url) {
  var container = App.__container__,
      userController = container.lookup("controller:user"),
      isLoggedIn = userController.get('isLoggedIn'),
      authParams = $.param(userController.getProperties('username', 'password'));

  var fullURL = (App.USE_TEST_SERVER ? "http://bugzilla-api.erikbryn.com/staging/rest.cgi/" : "https://api-dev.bugzilla.mozilla.org/latest/") + url;

  if (isLoggedIn) {
    fullURL += (url.indexOf("?") === -1 ? "?" : "&" ) + authParams;
  }

  return fullURL;
}

export = urlFor;
