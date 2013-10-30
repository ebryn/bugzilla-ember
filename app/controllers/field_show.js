var Controller = Ember.ObjectController.extend({
  hasValue: function() {
    var value = this.get("currentValue");
    if (value && value !== "--" && value !== "---" && value !== "" && value.length !== 0) {
      return true;
    }
  }.property("currentValue"),

  isHidden: function() {
    if (!this.get('hasValue')) { return true; }

    var fieldName = this.get('name');
    if (fieldName === 'id' || fieldName === 'summary') { return true; }
  }.property('hasValue', 'name')
});

export default Controller;
