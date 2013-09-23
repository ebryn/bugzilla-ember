import Bug from 'bugzilla/models/bug';

var Route = Ember.Route.extend({
  model: function(params) {
    return Bug.newRecord(params.product);
  },

  actions: {
    bugWasCreated: function(bug) {
      this.transitionTo('bug', bug);
    }
  }
});

export default Route;
