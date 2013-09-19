var GroupsCheckboxView = Ember.View.extend({
  tagName: 'input',
  attributeBindings: ['type'],
  type: 'checkbox',

  name: null,

  change: function(e) {
    var parentView = this.get('parentView'),
        name = this.get('name');

    if (e.target.checked) {
      parentView.groupWasChecked(name);
    } else {
      parentView.groupWasUnchecked(name);
    }
  }
});

export default GroupsCheckboxView;