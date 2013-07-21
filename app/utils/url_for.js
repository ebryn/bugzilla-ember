// FIXME: This is kinda hacky. We have a plan for making this cleaner with the container.
import App from 'bugzilla/app';

function urlFor(url) {
  var container = App.__container__,
      userController = container.lookup("controller:user"),
      isLoggedIn = userController.get('isLoggedIn'),
      authParams = $.param({
        Bugzilla_token: userController.get('token')
      }),
      config = container.lookup('config:main');

  var fullURL = config.get('host') + config.get('path') + url;

  if (isLoggedIn) {
    fullURL += (url.indexOf("?") === -1 ? "?" : "&" ) + authParams;
  }

  return fullURL;
}

export default urlFor;
