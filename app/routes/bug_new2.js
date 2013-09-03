import urlFor from "bugzilla/utils/url_for";
import getJSON from "bugzilla/utils/get_json";

var Route = Ember.Route.extend({
  model: function(params) {
    return getJSON(urlFor("ember/create/" + params.product));
  },

  setupController: function(controller, model) {
    controller.set('content', this.create('bug'));
    // controller.set('content', model);
    controller.set('product', model.product);
    controller.set('fields', model.fields);
  }
});

export default Route;
