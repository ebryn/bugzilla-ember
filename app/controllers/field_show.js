var Controller = Ember.ObjectController.extend({
  hasValue: function() {
    var value = this.get("current_value");
    if (value !== "--" && value !== "---" && value !== "" && value.length !== 0) { return true; }
  }.property("current_value"),

  isHidden: function() {
    if (!this.get('hasValue')) { return true; }

    var fieldName = this.get('api_name');
    if (fieldName === 'id' || fieldName === 'summary') { return true; }
  }.property('hasValue', 'api_name')
});

export default Controller;