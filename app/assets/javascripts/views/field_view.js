App.FieldView = Ember.View.extend({
  tagName: 'span',
  templateName: 'field',

  valueDidChange: function() {
    this.$('span').addClass('fade-in');
    setTimeout(function() {
      this.$('span').removeClass('fade-in');
    }, 500);
  }.observes('value')
});