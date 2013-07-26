import getJSON from 'bugzilla/utils/get_json' ;
import urlFor from 'bugzilla/utils/url_for'  ;
import unhandledRejection from 'bugzilla/utils/unhandled_rejection';

function setFieldsOn(obj) {
  return function(json) {
    var fieldsByName = {};

    json.fields.forEach(function(field) {
      fieldsByName[field.name.replace(".", "|")] = field;
    });

    Ember.setProperties(obj, fieldsByName);

    return json;
  };
}

var Controller = Ember.Controller.extend({
  init: function() {
    this._super();

    var url = urlFor('field/bug');

    getJSON(url).then(setFieldsOn(this)).then(null, unhandledRejection);

    return this;
  }
});

export default Controller;
