var Controller = Ember.ObjectController.extend({
  prompt: function() {
    var firstValue = this.get('values.firstObject.name'),
        fieldName = this.get('api_name');

    if (firstValue === "--" || firstValue === "---") { return; }

    if (fieldName === "platform" || fieldName === "op_sys" || fieldName === "status") { return; }

    return "[%@]".fmt(this.get('display_name'));
  }.property('api_name', 'display_name', 'values.firstObject.name'),

  defaultValue: function() {
    var fieldName = this.get('api_name');

    if (fieldName === "severity") { return 'normal'; }
    if (fieldName === "platform") {
      return 'x86'; // TODO
    }
    if (fieldName === "op_sys") {
      return 'Mac OS X'; // TODO
    }
  }.property('api_name'),

  isDisabled: function() {
    var fieldName = this.get('api_name');

    if (fieldName === 'status') { return true; }
  }.property('api_name')
});

export default Controller;