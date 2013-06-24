import 'bugzilla/views/field' as FieldView;

Ember.Handlebars.registerHelper('field', function(key, options) {
  options.hash.valueBinding = key;
  return Ember.Handlebars.helpers.view.call(this, FieldView, options);
});
