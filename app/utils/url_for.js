function urlFor(url) {
  var container = window.Bugzilla.__container__,
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
