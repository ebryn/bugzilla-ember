import FieldView from 'bugzilla/views/field';

Ember.Handlebars.registerHelper('field', function(key, options) {
  options.hash.valueBinding = key;
  return Ember.Handlebars.helpers.view.call(this, FieldView, options);
});
