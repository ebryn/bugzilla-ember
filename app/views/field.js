var FieldView = Ember.View.extend({
  tagName: 'span',
  templateName: 'field',
  flashOnValueChange: true,
  isEditing: Ember.computed.and('context.can_edit', 'controller.isEditing'),
  value: Ember.computed.alias('context.current_value'),

  isTextField: function() {
    var values = this.get('context.values');
    return Ember.typeOf(values) !== "array";
  }.property('context.values'),

  controllerContextWillChange: function() {
    this.set('flashOnValueChange', false);
  }.observesBefore('controller.context'),

  controllerContextDidChange: function() {
    Ember.run.scheduleOnce('afterRender', this, 'set', 'flashOnValueChange', true);
  }.observes('controller.context'),

  _valueDidChange: function() {
    if (!this.get('flashOnValueChange')) {
      return;
    }

    this.$('span').addClass('fade-in');

    setTimeout(function() {
      this.$('span').removeClass('fade-in');
    }, 500);

  }.observes('value')
});

export default FieldView;
