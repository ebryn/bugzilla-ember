import 'bugzilla/utils/get_json' as getJSON;
import 'bugzilla/utils/url_for' as urlFor;

// TODO: remove app dependency
import 'bugzilla/app' as App;

function login(username, password){
  var params =  {
    login: username,
    password: password
  };

  // FIXME: proper auth API endpoint
  return getJSON(urlFor("login"), params);
}

export = login;
