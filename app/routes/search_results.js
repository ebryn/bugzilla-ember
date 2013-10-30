import Bug from "bugzilla/models/bug";

var Route = Ember.Route.extend({
  model: function(params, queryParams, transition) {
    if (!queryParams.q) { return; }

    return Bug.findQuery({
      quicksearch: queryParams.q,
      include_fields: 'id, product, component, assigned_to, status, summary, last_change_time'
    });
  },

  setupController: function(controller, model, queryParams) {
    controller.set('model', model);
    controller.set('quicksearch', queryParams.q);
  }
});

export default Route;