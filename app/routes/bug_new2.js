import urlFor from "bugzilla/utils/url_for";
import getJSON from "bugzilla/utils/get_json";

var Route = Ember.Route.extend({
  model: function(params) {
    return getJSON(urlFor("ember/create/" + params.product).replace(/\?.*$/, '') /* FIXME: remove replace when create API is fixed */).then(function(json) {
      var ret = {
        product: json.product,
        fields: {},
        customFields: []
      };

      json.fields.forEach(function(field) {
        if (field.is_custom) {
          ret.customFields.push(field);
        } else {
          ret.fields[field.name] = field;
        }
      });

      return ret;
    });
  },

  setupController: function(controller, model) {
    controller.set('content', this.create('bug'));
    controller.set('product', model.product);
    controller.set('fields',  model.fields);
    controller.set('customFields', model.customFields);
  }
});

export default Route;
