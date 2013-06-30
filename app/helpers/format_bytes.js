Ember.Handlebars.helper('formatBytes', function(value) {
  return (value / 1024.0).toPrecision(3) + "KB";
});
