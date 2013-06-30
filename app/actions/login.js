import 'bugzilla/utils/get_json' as getJSON;

function login(username, password){
  var params =  {
    username: username,
    password: password
  };

  return getJSON("https://api-dev.bugzilla.mozilla.org/latest/user/persona@erikbryn.com", params);
}

export = login;
