Ember.Handlebars.helper('pluralize', function(count, singular) {
  var word = count == 1 ? singular : Ember.String.pluralize(singular);
  return count + ' ' + word;
});