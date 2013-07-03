import 'bugzilla/utils/get_json' as getJSON;
import 'bugzilla/utils/url_for' as urlFor;

// TODO: remove app dependency
import 'bugzilla/app' as App;

function login(username, password){
  var params =  {
    username: username,
    password: password
  };

  // FIXME: proper auth API endpoint
  return getJSON(urlFor("bug/" + (App.USE_TEST_SERVER ? 11736 : 856410)), params);
}

export = login;
