import Bug from "bugzilla/models/bug";

var Route = Ember.Route.extend({
  model: function(params) {
    return Bug.fetch(params.bug_id);
  },

  actions: {
    error: function(a,b,c,d) {
      debugger;
    }
  }
});

export default Route;