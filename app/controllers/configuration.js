import getJSON from 'bugzilla/utils/get_json' ;
import urlFor from 'bugzilla/utils/url_for'  ;

var Controller = Ember.Controller.extend({
  init: function() {
    this._super();

    var self = this,
        url = urlFor("field/bug");

    getJSON(url).then(function(json) {
      var fieldsByName = {};
      json.fields.forEach(function(field) {
        fieldsByName[field.name] = field;
      });
      Ember.setProperties(self, fieldsByName);
    });

    return this;
  }
});

export default Controller;