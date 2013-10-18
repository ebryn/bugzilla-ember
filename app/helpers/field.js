import FieldView from 'bugzilla/views/field';

Ember.Handlebars.registerHelper('field', function(key, options) {
  var context;

  if (options.types[0] === 'STRING') {
    key = 'fields.' + key;
  }

  context = Ember.Handlebars.get(this, key);
  var currentView = options.data.view;
  var newView = currentView.appendChild(FieldView, {_context: context, templateData: options.data});

  var observer = function() {
    if (newView.isDestroyed) {
      this.removeObserver(key, observer);
    } else {
      newView.set('context', this.get(key));
    }
  };

  this.addObserver(key, observer);
});
