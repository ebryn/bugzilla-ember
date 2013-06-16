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

function unhandledRejection(reason){
  Ember.Logger.error(reason);
  Ember.Logger.assert(reason);

  setTimeout(function(){
    throw reason;
  }, 0);
}

Ember.unhandledRejection = unhandledRejection;

App.promiseStorage = {
  getItem: function(key, callback) {
    return new Ember.RSVP.Promise(function(resolve, reject){
      asyncStorage.getItem(key, function(value){
        Ember.run(null, resolve, value);
      });
    });
  }
};

