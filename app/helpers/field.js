import FieldView from 'bugzilla/views/field';

Ember.Handlebars.registerHelper('field', function(key, options) {
  var context;

  if (options.types[0] === 'STRING') {
    key = 'fields.' + key;
  }

  context = Ember.Handlebars.get(this, key);
  return Ember.Handlebars.helpers.view.call(context, FieldView, options);
});
