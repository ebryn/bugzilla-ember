var Controller = Ember.ObjectController.extend({
  prompt: function() {
    var firstValue = this.get('values.firstObject.name');

    if (firstValue === "--" || firstValue === "---") { return; }

    return "[%@]".fmt(this.get('description'));
  }.property('description', 'values.firstObject.name'),

  defaultValue: Ember.computed.alias('default_value')
});

export default Controller;