import Bug from "bugzilla/models/bug";

var Route = Ember.Route.extend({
  model: function(params, queryParams, transition) {
    return Bug.findQuery({quicksearch: queryParams.q});
  }
});

export default Route;