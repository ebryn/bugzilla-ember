var promiseStorage = {
  getItem: function(key, callback) {
    return new Ember.RSVP.Promise(function(resolve, reject){
      asyncStorage.getItem(key, function(value){
        Ember.run(null, resolve, value);
      });
    });
  }
};

export default promiseStorage;
