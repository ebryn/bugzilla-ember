Ember.Handlebars.helper('emailToUsername', function(value) {
  return (value || "").split('@')[0];
});