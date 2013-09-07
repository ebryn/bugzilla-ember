import Bug from "bugzilla/models/bug";

var Route = Ember.Route.extend({
  model: function(params) {
    return Bug.fetch(params.bug_id);
  }
});

export default Route;