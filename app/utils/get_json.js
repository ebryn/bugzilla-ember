function getJSON(url, params) {
  var args = arguments;

  return new Ember.RSVP.Promise(function(resolve, reject){
    $.getJSON.apply($, args).then(function(json, status, xhr) {
      if (json.error) {
        // avoid issue with successfully resolved xhr promise causing rejection to fail
        xhr.then = null;
        Ember.run(null, reject, xhr);
      } else {
        Ember.run(null, resolve, json);
      }
    }, function(xhr) {
      Ember.run(null, reject, xhr);
    });
  });
}

export default getJSON;
