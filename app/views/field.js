var FieldView = Ember.View.extend({
  tagName: 'span',
  templateName: 'field',
  flashOnValueChange: true,
  isEditing: Ember.computed.and('context.canEdit', 'controller.isEditing'),
  value: Ember.computed.alias('context.currentValue'),

  isTextField: function() {
    var values = this.get('context.values');
    return !this.get('isTextArea') && Ember.typeOf(values) !== "array";
  }.property('context.values', 'isTextArea'),

  isSelect: function() {
    return !(this.get('isTextField') || this.get('isTextArea'));
  }.property('isTextField', 'isTextArea'),

  isTextArea: function() {
    return this.get('context.type') === 'textarea';
  }.property('context.type'),

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

  }.observes('value'),

  _setupAutoSize: function() {
    if (this.get('isTextArea') && this.get('isEditing')) {
      this.$('textarea').autosize();
    }
  }.on('didInsertElement'),

  _teardownAutoSize: function() {
    if (this.get('isTextArea') && this.get('isEditing')) {
      var element = this.get('element');
      Ember.$('textarea', element).trigger('autosize.destroy');
    }
  }.on('willDestroyElement')
});

export default FieldView;
