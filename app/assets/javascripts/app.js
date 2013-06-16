window.App = Ember.Application.create();

App.getJSON = function(url, params) {
  var args = arguments;
  return new Ember.RSVP.Promise(function(resolve, reject){
    $.getJSON.apply($, args).then(function(value) {
      Ember.run(null, resolve, value);
    }, function(reason) {
      Ember.run(null, reject, arguments);
    });
  });
};
