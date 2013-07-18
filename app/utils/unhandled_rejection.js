function unhandledRejection(reason){
  Ember.Logger.error(reason);
  Ember.Logger.assert(reason);

  setTimeout(function(){
    throw reason;
  }, 0);
}

export default unhandledRejection;
