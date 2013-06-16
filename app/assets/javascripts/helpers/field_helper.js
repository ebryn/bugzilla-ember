//= require views/field_view

Ember.Handlebars.registerHelper('field', function(key, options) {
  options.hash.valueBinding = key;
  return Ember.Handlebars.helpers.view.call(this, App.FieldView, options);
});