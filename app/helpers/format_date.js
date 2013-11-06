Ember.Handlebars.helper('formatDate', function(value) {
  var date = moment(value);
  return date.fromNow();
});
