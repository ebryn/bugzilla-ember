var Promise = Ember.RSVP.Promise;

var promiseStorage = {
  getItem: function(key) {
    return new Promise(function(resolve, reject){
      asyncStorage.getItem(key, function(value){
        Ember.run(null, resolve, value);
      });
    });
  },
  setItem: function(key, value) {
    return new Promise(function(resolve, reject){
      asyncStorage.setItem(key, value, function(value){
        Ember.run(null, resolve, value);
      });
    });
  }
};

export default promiseStorage;
